import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { FHService, ProgramService, DictionaryService, HistoricalIndexService } from 'api-kit';
import { FilterMultiArrayObjectPipe } from '../app-pipes/filter-multi-array-object.pipe';

import * as _ from 'lodash';
import * as d3 from 'd3';


@Component({
  moduleId: __filename,
  templateUrl: 'assistance-listing.page.html',
  styleUrls: ['assistance-listing.style.css'],
  providers: [
    FHService,
    ProgramService,
    DictionaryService,
    HistoricalIndexService,
    FilterMultiArrayObjectPipe
  ]
})
export class ProgramPage implements OnInit {
  oProgram:any;
  oFederalHierarchy:any;
  federalHierarchyWithParents:any
  aRelatedProgram:any[] = [];
  currentUrl:string;
  aDictionaries:any = [];
  authorizationIdsGrouped:any[];
  oHistoricalIndex:any;
  aAlert:any = [];

  private sub:Subscription;

    constructor(
      private route:ActivatedRoute,
      private location:Location,
      private oHistoricalIndexService: HistoricalIndexService,
      private oProgramService:ProgramService,
      private oFHService:FHService,
      private oDictionaryService:DictionaryService,
      private FilterMultiArrayObjectPipe: FilterMultiArrayObjectPipe) {}

  ngOnInit() {
    this.currentUrl = this.location.path();

    //init Dictionaries
    let aDictionaries = [
      'program_subject_terms',
      'date_range',
      'match_percent',
      'assistance_type',
      'applicant_types',
      'assistance_usage_types',
      'beneficiary_types',
      'functional_codes'
    ];

    this.sub = this.route.params.subscribe(params => {
      let id = params['id']; //id will be a string, not a number
      this.oProgramService.getProgramById(id).subscribe(res => {
          this.oProgram = res;

          //check if this program has changed in this FY
          if ((new Date(this.oProgram.publishedDate)).getFullYear() < new Date().getFullYear()) {
              this.aAlert.push({"labelname":"not-updated-since", "config":{ "type": "warning", "title": "", "description": "Note: \n\
This Federal Assistance Listing was not updated by the issuing agency in "+(new Date()).getFullYear()+". \n\
Please contact the issuing agency listed under \"Contact Information\" for more information." }});
          }

          this.oDictionaryService.getDictionaryById(aDictionaries.join(',')).subscribe(res => {
            for (var key in res) {
              this.aDictionaries[key] = res[key];
            }
            if(this.oProgram.data.financial.obligations){
              this.createVisualization(this.prepareVisualizationData(this.oProgram.data.financial.obligations));
            }
          });
          //get authorizations and group them by id
          var auths = this.oProgram.data.authorizations;
          this.authorizationIdsGrouped = _.values(_.groupBy(auths, 'authorizationId'));
          this.oFHService.getFederalHierarchyById(res.data.organizationId,false,false)
            .subscribe(res => {
              this.oFederalHierarchy = res;
            });
          this.oFHService.getFederalHierarchyById(res.data.organizationId,true,false)
            .subscribe(res => {
              this.federalHierarchyWithParents = res;
            });
          this.oHistoricalIndexService.getHistoricalIndexByProgramNumber(id, this.oProgram.data.programNumber)
            .subscribe(res => {
              this.oHistoricalIndex = res._embedded ? res._embedded.historicalIndex : [];
          });
          if (this.oProgram.data.relatedPrograms.flag != "na") {
            for (let programId of this.oProgram.data.relatedPrograms.relatedTo) {
              this.oProgramService.getLatestProgramById(programId).subscribe(relatedFal => {
                if(typeof relatedFal !== 'undefined')
                {
                  this.aRelatedProgram.push({
                    "programNumber": relatedFal.data.programNumber,
                    "id": relatedFal.data._id
                  });
                }
              })
            }
          }
        },
          err => {
          console.log('Error logging', err)
        }
      );

    });
  }


  createVisualization(financialData): void {

    /**
     * --------------------------------------------------
     * Containers
     * --------------------------------------------------
     */
    d3.select("#visualization")
      .insert("svg")
      .attr("id", "chart")
      .attr("style", "width: 100%; height:300px;");

    d3.select("#visualization")
      .insert("table")
      .attr("id", "chart-table");

    /**
     * --------------------------------------------------
     * Data Grouping
     * --------------------------------------------------
     */
    let assistanceTotals = d3.nest()
      .key(d => d.obligation)
      .key(d => d.year)
      .sortKeys(d3.ascending)
      .rollup( values => {
        let ena = false,
            nsi = false;
        values.forEach(item => {
          if(item.ena){ ena = true; }
          if(item.nsi){ nsi = true; }
        });
        return {
          "items": values.length,
          "ena": ena, 
          "nsi": nsi, 
          "total": d3.sum(values, d => +d.amount)
        }
      })
      .entries(financialData);

    let assistanceTotalsGroupedByYear = d3.nest()
      .key(d => d.year)
      .sortKeys(d3.ascending)
      .key(d => d.obligation)
      .rollup(values => {
        let isEstimate = false,
            year,
            formatyear;
        values.forEach(item => {
          if(item.estimate){ isEstimate = true; }
          year = item.year;
        });
        return {
          "year": formatYear(String(year),isEstimate), 
          "total": d3.sum(values, d => +d.amount) 
        }
      })
      .entries(financialData);

    let assistanceDetails = d3.nest()
      .key(d => d.obligation)
      .key(d => d.info)
      .key(d => d.year)
      .sortKeys(d3.ascending)
      .entries(financialData);

    let vizTotals = d3.nest()
      .key(d => d.year)
      .sortKeys(d3.ascending)
      .rollup(values => {
        let obligations = d3.map(),
            ena = false,
            nsi = false;
        values.forEach(item => {
          if(item.ena){ ena = true; }
          if(item.nsi){ nsi = true; }
          obligations.set(item.obligation, obligations.get(item.obligation) ? obligations.get(item.obligation) + 1 : 1);
        });
        return {
          "obligations": obligations.entries(),
          "ena": ena, 
          "nsi": nsi, 
          "total": d3.sum(values, d => +d.amount) 
        }
      })
      .entries(financialData);

    /**
     * --------------------------------------------------
     * Stack Chart
     * --------------------------------------------------
     */

    let svg = d3.select("#visualization > svg");
    let margin = { top: 30, left: 110, right: 20, bottom: 40 };

    let height = parseInt(svg.style("height"), 10) - margin.top - margin.bottom;
    let width = parseInt(svg.style("width"), 10) - margin.left - margin.right;
    svg.attr("height", parseInt(svg.style("height"), 10));
    svg.attr("width", parseInt(svg.style("width"), 10));

    const stackColors = [
      "#046b99", "#9bdaf1", "#5b616b", "#fad980", "#cd2026",
      "#e59393", "#00a6d2", "#f9c642", "#aeb0b5", "#981b1e",
      "#3e94cf", "#4c2c92", "#8ba6ca"
    ];

    let { series: series, keys: stackKeys } = getStackProperties(assistanceTotalsGroupedByYear);

    // Axis Range
    let x = d3.scaleBand().range([0, width]).padding(0.25);
    let y = d3.scaleLinear().range([height, 0]);
    let z = d3.scaleOrdinal().range(stackColors);

    // Axis Domain
    let yDomainMax = d3.max(vizTotals, item => item.value.total );
    x.domain(assistanceTotalsGroupedByYear.map( d => d.values[0].value.year ));
    y.domain([0, yDomainMax ]).nice();
    z.domain(stackKeys);

    // Build chart only if Y axix has values
    yDomainMax > 0 ? buildStackBar() : svg.style("display", "none");

    function buildStackBar(){
      let g = svg.append("g")
      .attr("class", "bars")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Data Join
      let chart = g.selectAll(".serie")
        .data(series, d => d);

      // Enter
      let graph = chart.enter().append("g");

      let serie = graph.attr("class", "serie")
        .attr("data-assistance", d => d.key )
        .attr("fill", d => z(d.key));

      let rect = serie.selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", d => x(d.data.values[0].value.year) + (x.bandwidth() / 4))
        .attr("y", d => y(d[1]) )
        .style("cursor", "pointer")
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth() / 2);

      buildAxis();
      buildTooltip(rect);
    }

    function buildAxis(){
      let axis = svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      let xAxis = d3.axisBottom(x)
        .tickSizeInner(0)
        .tickSizeOuter(0)
        .tickPadding(10);

      let yAxis = d3.axisLeft(y)
        .ticks(5, "$,r")
        .tickSizeInner(-width)
        .tickSizeOuter(0)
        .tickPadding(5);;

      let gX = axis.append("g")
        .attr("class", "axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("x", width / 2)
        .attr("y", -(height + 15))
        .attr("text-anchor", "middle")
        .attr("fill", "#000")
        .attr("class", "svg-font-bold")
        .text("Obligation(s)");

      let gY = axis.append("g")
        .attr("class", "axis--y")
        .call(yAxis);

      // Clean DOM
      d3.select(".axis--y .domain").remove();

      // Style
      d3.selectAll("svg text").attr("style", "font-size: 17px; font-family: 'Source Sans Pro';");
      d3.selectAll(".svg-font-bold").attr("style", "font-size: 17px; font-family: 'Source Sans Pro'; font-weight: 700;");
      d3.selectAll("svg .axis--y .tick line").attr("style", "stroke: rgba(0, 0, 0, 0.1);");
    }

    function buildTooltip(rect){
      let tooltip;
      rect.on("mouseover", d => {
          tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("display", "inline")
            .style("position", "absolute")
            .style("text-align", "center")
            .style("font", "14px Source Sans Pro")
            .style("padding", "10px")
            .style("margin", "20px 0 0 20px")
            .style("background", "white")
            .style("-webkit-box-shadow", "3px 5px 30px -4px rgba(0,0,0,0.33)")
            .style("-moz-box-shadow", "3px 5px 30px -4px rgba(0,0,0,0.33)")
            .style("box-shadow", "3px 5px 30px -4px rgba(0,0,0,0.33)")
        })
        .on("mousemove", function(d){
          if(tooltip){
            tooltip.html(this.parentNode.attributes["data-assistance"].value + "<span style='display: block; font-size: 17px; font-weight: 700;'>" + d3.format("($,")(d[1] - d[0]) + "</span>")
              .style("left", (d3.event.pageX - 30) + "px")
              .style("top", (d3.event.pageY - 10) + "px");
          }
        })
        .on("mouseout", () => {
          d3.select(".tooltip").remove();
        });
    }

    function formatYear(year: string, estimate: boolean): string {
      let formattedYear = "FY " + year.slice(2, 4);
      return estimate ? formattedYear + " (est.)" : formattedYear;
    }

    function getStackProperties(data) {
      let loopCounter = 0,
          yearLoop = 0,
          stackKeys = d3.set();

      let stack = d3.stack()
        .keys( d => {
          d.forEach( e => {
            e.values.forEach( el => {
              stackKeys.add(el.key);
            });
          });
          return stackKeys.values();
        })
        .value( (d, key, i, m) => {
          if (loopCounter == m.length) {
            loopCounter = 0;
            yearLoop++;
          }
          loopCounter++;
          return d.values[yearLoop].value.total;
        });

      return { 
        "series": stack(data), 
        "keys": stackKeys.values() 
      };
    }

    /**
     * --------------------------------------------------
     * Table
     * --------------------------------------------------
     */

    function actualOrEstimate(year: number): string{
      if (new Date(year, null).getFullYear() <= new Date().getFullYear()){
        return "Actual Not Available"
      }else{
        return "Estimate Not Available";
      }
    }

    (function buildTable(){
      let table = d3.select("#visualization table");
      let thead = table.append("thead");
      let tbody = table.append("tbody");

      // Table header
      thead.selectAll("th")
        .data(assistanceTotalsGroupedByYear)
        .enter()
        .append("th")
        .text(d => d.values[0].value.year);

      thead.insert("th", ":first-child")
        .text("Obligation(s)");

      // Table: Assistance Totals
      tbody.selectAll("tr")
        .data(assistanceTotals)
        .enter()
        .append("tr")
        .style("font-weight", "700")
        .attr("class", "total")
        .selectAll("td")
        .data( d => d.values)
        .enter()
        .append("td")
        .html(d => {
          if(d.value.ena && !d.value.total){
            return d.value.items > 1 ? "Not Available" : actualOrEstimate(d.key);
          }else if(d.value.nsi && !d.value.total){
            return "Not Separately Identifiable";
          }else{
            return d3.format("($,")(d.value.total);
          }
        });

      // Insert assistance type name column
      tbody.selectAll("tr")
        .data(assistanceTotals)
        .insert("td", ":first-child")
        .html(d => {
          return `<span class="legend" 
                        style="background-color:` + z(d.key) + `;
                              border:1px solid #000; 
                              width: 10px; 
                              height: 10px; 
                              display: inline-block;">
                  </span> ` + d.key + " Total";
        });

      // Table: Assistance Details
      tbody.selectAll("tr")
        .data(assistanceDetails)
        .append("tr")
        .attr("class", "details")
        .selectAll("td")
        .data(d => d.values)
        .enter()
        .append("tr")
        .attr("class", "detail")
        .html(function (d: any) {
          let explanation = "";
          d.values.forEach(item => {
            item.values.forEach( innerItem =>{
              if(innerItem.explanation){
                explanation +=  "FY " + item.key.slice(2,4) + 
                                " Exp: " + innerItem.explanation + ", ";
              }
            });
          });
          if(!d.key && !explanation && d.values[0].values[0].quantity == 1){
            // If additional info content its empty
            // and there is not an optional explanation
            // and if there is only one obligation, remove row
            this.parentNode.removeChild(this);
          }
          return "<td>" + d.key + ( explanation  ? "(" + explanation.slice(0,-2) +  ")" : "") +  "</td>";
        })
        .selectAll("tr")
        .data(d => d.values)
        .enter()
        .append("td")
        .text(d => {
          if(d.values[0].ena && !d.values[0].amount ){
            return actualOrEstimate(d.key);
          }else if(d.values[0].nsi && !d.values[0].amount ){
            return "Not Separately Identifiable";
          }else{
            return d3.format("($,")(d.values[0].amount);
          }
        });

      // Move and unwrap assistance details
      d3.selectAll("tr.details").each( function() {
        this.parentNode.parentNode.insertBefore(this, this.parentNode.nextSibling);
        this.outerHTML = this.innerHTML;
      });

      // Table Totals
      table.selectAll("tbody")
        .append("tr")
        .html("<td>Totals</td>")
        .style("font-weight", "700")
        .attr("class", "totals")
        .selectAll("tr")
        .data(vizTotals)
        .enter()
        .append("td")
        .html(d => {
          let maxNumberOfObligationTypesFound = d3.max(d.value.obligations, item => item.value);
          if(d.value.ena || d.value.nsi ){
            return d.value.total == 0 
                    ? !d.value.ena 
                      ? "Not Separately Identifiable" 
                      : maxNumberOfObligationTypesFound > 1 
                        ? "Not Available" 
                        : actualOrEstimate(d.key)
                    : d3.format("($,")(d.value.total);
          }
          return d3.format("($,")(d.value.total);
        });
    })();
    
  }

  prepareVisualizationData(financialData){

    let self = this;
    let formattedFinancialData = [];
    let obligations = d3.map();
    let numberOfYears = 3;

    function getAssistanceType(id): string {
      return self.FilterMultiArrayObjectPipe.transform([id], self.aDictionaries.assistance_type, 'element_id', true, 'elements')[0].value;
    }
    
    financialData.map(function(item){
      for(let year in item.values){
        let obligation = "No Obligation";
        if(item.assistanceType && item.assistanceType.length > 0){
         obligation = getAssistanceType(item.assistanceType);
        }else if(item.questions.salary_or_expense.flag === "yes"){
          obligation = "Salary or Expense";
        }

        obligations.set(obligation, obligations.get(obligation) ? obligations.get(obligation) + 1 : 1);

        let financialItem = {
          "obligation": obligation,
          "info": item.additionalInfo ? item.additionalInfo.content || "" : "",
          "year": +year,
          "amount": item.values[year]["actual"] || item.values[year]["estimate"] || 0,
          "estimate": !!!item.values[year]["actual"],
          "ena": item.values[year].flag == "ena" || item.values[year].flag == "na" ? true : false,
          "nsi": item.values[year].flag == "nsi" || item.values[year].flag == "no" ? true : false,
          "explanation": item.values[year].explanation || ""
        }
        formattedFinancialData.push(financialItem);
      }
    });

    formattedFinancialData.forEach(function(item){
      item.quantity = obligations.get(item.obligation) / numberOfYears;
    });

    return formattedFinancialData;
  }

}
