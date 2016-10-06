import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import {FHService} from '../../common/service/api/fh.service';
import {ProgramService} from '../services/program.service';
import { Subscription } from 'rxjs/Subscription';
import {DictionaryService} from '../services/dictionary.service';
import {HistoricalIndexService} from '../services/historical-index.service';
import { FilterMultiArrayObjectPipe } from '../../common/pipes/filter-multi-array-object.pipe';
import * as _ from 'lodash';
import * as d3 from 'd3';


@Component({
  moduleId: __filename,
  templateUrl: 'program-view.component.html',
  styleUrls: ['program-view.style.css'],
  providers: [
    FHService,
    ProgramService,
    DictionaryService,
    HistoricalIndexService,
    FilterMultiArrayObjectPipe
  ]
})
export class ProgramViewComponent implements OnInit {
  oProgram:any;
  oFederalHierarchy:any;
  aRelatedProgram:any[] = [];
  currentUrl:string;
  aDictionaries:any = [];
  authorizationIdsGrouped:any[];
  oHistoricalIndex:any;

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

    this.oDictionaryService.getDictionaryById(aDictionaries.join(',')).subscribe(res => {
      for (var key in res) {
        this.aDictionaries[key] = res[key];
      }
    });

    this.sub = this.route.params.subscribe(params => {
      let id = params['id']; //id will be a string, not a number
      this.oProgramService.getProgramById(id).subscribe(res => {
          this.oProgram = res;

          this.oDictionaryService.getDictionaryById(aDictionaries.join(',')).subscribe(res => {
            for (var key in res) {
              this.aDictionaries[key] = res[key];
            }
            if(this.oProgram.program.data.financial.obligations){
              this.createVisualization(this.prepareVisualizationData(this.oProgram.program.data.financial.obligations));
            }
          });
          //get authorizations and group them by id
          var auths = this.oProgram.program.data.authorizations;
          this.authorizationIdsGrouped = _.values(_.groupBy(auths, 'authorizationId'));
          this.oFHService.getFederalHierarchyById(res.program.data.organizationId,false,false)
            .subscribe(res => {
              this.oFederalHierarchy = res;
            });
          this.oHistoricalIndexService.getHistoricalIndexByProgramNumber(id, this.oProgram.program.data.programNumber)
            .subscribe(res => {
              this.oHistoricalIndex = res;
          });
          if (this.oProgram.program.data.relatedPrograms.flag != "na") {
            for (let programId of this.oProgram.program.data.relatedPrograms.relatedTo) {
              this.oProgramService.getProgramById(programId).subscribe(relatedFal => {
                console.log("Latest: ", relatedFal.program.latest);
                console.log("Archived: ", relatedFal.program.archived);
                if (relatedFal.program.archived == false && relatedFal.program.latest == true){
                  this.aRelatedProgram.push({"programNumber": relatedFal.program.data.programNumber, "id": relatedFal.program.data._id});
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


  createVisualization(data): void {

    d3.select("#visualization")
      .insert("svg")
      .attr("id", "chart")
      .attr("style", "width: 100%; height:400px;");

    d3.select("#visualization")
      .insert("table")
      .attr("id", "chart-table");

    // Prepare data
    let { graph: graphData, table: tableData } = data;

    // Graph
    const chartID = "#chart";
    const stackColors = [
      "#046b99",
      "#9bdaf1",
      "#5b616b",
      "#fad980",
      "#cd2026",
      "#e59393",
      "#00a6d2",
      "#f9c642",
      "#aeb0b5",
      "#981b1e",
      "#3e94cf",
      "#4c2c92",
      "#8ba6ca"
    ];

    const svg = d3.select(chartID);
    const margin = { top: 30, left: 120, right: 20, bottom: 30 };
    const height = parseInt(svg.style("height"), 10) - margin.top - margin.bottom;
    const width = parseInt(svg.style("width"), 10) - margin.left - margin.right;
    const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleBand().rangeRound([0, width]).padding(0.3).align(.5);
    const y = d3.scaleLinear().rangeRound([height, 0]);
    const z = d3.scaleOrdinal().range(stackColors);

    x.domain(graphData.map(function (d) { return d["Year"]; }));
    y.domain([0, d3.max(graphData, function (d) { return d.total; })]).nice();
    z.domain(graphData.columns);

    var chart = g.selectAll(".serie")
      .data(d3.stack().keys(graphData.columns)(graphData));

    var graph = chart.enter().append("g");

    var serie = graph.attr("class", "serie")
      .attr("fill", function (d, i, j) { return z(d.key); });

    var rect = serie.selectAll("rect")
      .data(function (d) { return d; })
      .enter().append("rect")
      .attr("x", function (d) { return x(d.data["Year"]); })
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0);

    // Intro animation
    rect.transition(d3.transition().duration(500).ease(d3.easeQuad))
      .delay(function (d, i) { return i * 400 })
      .attr("y", function (d) { return y(d[1]); })
      .attr("height", function (d) { return y(d[0]) - y(d[1]); });

    g.append("g").attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).tickSizeInner(0).tickSizeOuter(0).tickPadding(10))
      .append("text")
      .attr("x", width / 2)
      .attr("y", -(height + 15))
      .attr("text-anchor", "middle")
      .attr("fill", "#000")
      .attr("class", "svg-font-bold")
      .text("Obligation(s)");

    g.append("g").attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(5, "$,r").tickSizeInner(-width).tickSizeOuter(0).tickPadding(10))
      .append("text")
      .attr("x", 5)
      .attr("y", -5);

    d3.select(".axis--y .domain").remove();
    d3.selectAll("svg text").attr("style", "font-size: 17px; font-family: 'Source Sans Pro';");
    d3.selectAll(".svg-font-bold").attr("style", "font-size: 17px; font-family: 'Source Sans Pro'; font-weight: 700;");
    d3.selectAll("svg .axis--y .tick line").attr("style", "stroke: rgba(0, 0, 0, 0.1);");

    // Table
    const table = d3.select("#chart-table");
    const thead = table.append("thead");
    const tbody = table.append("tbody");
    const numFormat = d3.format("($,");

    thead.selectAll("th")
      .data(tableData.columns)
      .enter().append("th")
      .text(function (d) { return d; });

    tbody.selectAll("tr")
      .data(tableData)
      .enter().append("tr")
      .selectAll("td")
      .data(function (d) {
        let cells = [];
        for (let i = 0; i < tableData.columns.length; ++i) {
          // Formats numbers
          // Note: Assumes that all columns except first one are numbers
          cells.push(i > 0 ? numFormat(d[tableData.columns[i]]) : "<span style=\"border: 1px solid #000; width: 10px; height: 10px; display: inline-block;background-color:" + z(d["Obligation(s)"]) + ";\"></span>  " + d[tableData.columns[i]]);
        }
        return cells;
      })
      .enter().append("td")
      .html(function (d) { return d; });

    // Remove legend from total row
    d3.select("#chart-table tr:last-child td span").remove();
    d3.selectAll("#chart-table tr:last-child td").attr("style", "font-weight: 700");

  }


  prepareVisualizationData(financialData): Object {

    let self = this;

    function formatYear(year: string, hasActual: boolean): string {
      let formattedYear = "FY" + year.slice(2, 4);
      return hasActual ? formattedYear : formattedYear + " (est.)";
    }

    function formatLabel(item): string {
      let assistanceType = getAssistanceType(item.assistanceType)[0].value;
      let itemLabel = assistanceType + " - " + item.additionalInfo.content.trim();
      return itemLabel;
    }

    function getAssistanceType(id): Object {
      return self.FilterMultiArrayObjectPipe.transform([id], self.aDictionaries.assistance_type, 'element_id', true, 'elements');
    }

    function graphData(): any[] {
      let transformedData = [];
      transformedData["columns"] = [];
      _.map(financialData, function (item: any) {
        let itemLabel = formatLabel(item);
        let newIndex = 0;
        for (let name in item.values) {
          let year = formatYear(name, item.values[name]["actual"]);
          transformedData[newIndex] = transformedData[newIndex] || {};
          transformedData[newIndex]["Year"] = year;
          transformedData[newIndex][itemLabel] = item.values[name]["actual"] || item.values[name]["estimate"];
          newIndex++;
        }
        transformedData["columns"].push(itemLabel);
      });

      // Add Total
      _.map(transformedData, function (item) {
        let total = 0;
        for (let name in item) {
          total += (name == "Year") ? 0 : Number(item[name]);
        }
        item.total = total;
      });

      return transformedData;
    }

    function tableData(): any[] {

      let transformedGraphData = graphData();
      let transformedData = [];
      let yearTotals = {};

      transformedData["columns"] = ["Obligation(s)"];
      yearTotals[transformedData["columns"][0]] = "Total";

      for(let i = 0; i < transformedGraphData.length; i++ ){
        yearTotals[transformedGraphData[i]["Year"]] = transformedGraphData[i].total;
        transformedData["columns"].push(transformedGraphData[i]["Year"]);
      }

      _.map(financialData, function (item: any, index) {
        let itemLabel = formatLabel(item);
        for (let name in item.values) {
          let year = formatYear(name, item.values[name]["actual"]);
          transformedData[index] = transformedData[index] || {};
          transformedData[index][year] = item.values[name]["actual"] || item.values[name]["estimate"];
        }
        transformedData[index]["Obligation(s)"] = itemLabel;
      });

      // Add Total
      transformedData.push(yearTotals);

      return transformedData;
    }

    return {
      graph: graphData(),
      table: tableData()
    }

  }

}
