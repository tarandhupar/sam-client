import { Component, Input } from '@angular/core';
import { FilterMultiArrayObjectPipe } from '../app-pipes/filter-multi-array-object.pipe';

import * as d3 from 'd3';
import * as _ from 'lodash';

@Component({
  moduleId: __filename,
  selector: 'financial-obligation-chart',
  template: '<div id="visualization"></div>',
  providers: [
    FilterMultiArrayObjectPipe
  ]
})
export class FinancialObligationChart {
  @Input() financialData:any[];
  @Input() dictionaries:any;

  constructor(private FilterMultiArrayObjectPipe: FilterMultiArrayObjectPipe) {
  }

  ngOnInit() {
    let visualizationData = this.prepareVisualizationData();
    if(visualizationData.length > 0){
      this.createVisualization(visualizationData);
    }
  }

  createVisualization(preparedFinancialData): void {

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
      .rollup(values => {
        let ena = false,
          nsi = false;
        values.forEach(item => {
          if (item.ena) {
            ena = true;
          }
          if (item.nsi) {
            nsi = true;
          }
        });
        return {
          "items": values.length,
          "ena": ena,
          "nsi": nsi,
          "total": d3.sum(values, d => +d.amount)
        }
      })
      .entries(preparedFinancialData);

    let assistanceTotalsGroupedByYear = d3.nest()
      .key(d => d.year)
      .sortKeys(d3.ascending)
      .key(d => d.obligation)
      .rollup(values => {
        let isEstimate = false,
          year,
          formatyear;
        values.forEach(item => {
          if (item.estimate) {
            isEstimate = true;
          }
          year = item.year;
        });
        return {
          "year": formatYear(String(year), isEstimate),
          "total": d3.sum(values, d => +d.amount)
        }
      })
      .entries(preparedFinancialData);

    let assistanceDetails = d3.nest()
      .key(d => d.obligation)
      .key(d => d.info)
      .key(d => d.year)
      .sortKeys(d3.ascending)
      .entries(preparedFinancialData);

    let vizTotals = d3.nest()
      .key(d => d.year)
      .sortKeys(d3.ascending)
      .rollup(values => {
        let ena = false,
          nsi = false;
        values.forEach(item => {
          if (item.ena) {
            ena = true;
          }
          if (item.nsi) {
            nsi = true;
          }
        });
        return {
          "ena": ena,
          "nsi": nsi,
          "total": d3.sum(values, d => +d.amount)
        }
      })
      .entries(preparedFinancialData);

    /**
     * --------------------------------------------------
     * Stack Chart
     * --------------------------------------------------
     */

    let svg = d3.select("#visualization > svg");
    let margin = {top: 30, left: 110, right: 20, bottom: 40};

    let height = parseInt(svg.style("height"), 10) - margin.top - margin.bottom;
    let width = parseInt(svg.style("width"), 10) - margin.left - margin.right;
    svg.attr("height", parseInt(svg.style("height"), 10));
    svg.attr("width", parseInt(svg.style("width"), 10));

    const stackColors = [
      "#046b99", "#9bdaf1", "#5b616b", "#fad980", "#cd2026",
      "#e59393", "#00a6d2", "#f9c642", "#aeb0b5", "#981b1e",
      "#3e94cf", "#4c2c92", "#8ba6ca"
    ];

    let {series: series, keys: stackKeys} = getStackProperties(assistanceTotalsGroupedByYear);

    // Axis Range
    let x = d3.scaleBand().range([0, width]).padding(0.25);
    let y = d3.scaleLinear().range([height, 0]);
    let z = d3.scaleOrdinal().range(stackColors);

    // Axis Domain
    let yDomainMax = d3.max(vizTotals, item => item.value.total);
    x.domain(assistanceTotalsGroupedByYear.map(d => d.values[0].value.year; ));
    y.domain([0, yDomainMax]).nice();
    z.domain(stackKeys);

    // Build chart only if Y axix has values
    yDomainMax > 0 ? buildStackBar() : svg.style("display", "none");

    function buildStackBar() {
      let g = svg.append("g")
        .attr("class", "bars")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Data Join
      let chart = g.selectAll(".serie")
        .data(series, d => d);

      // Enter
      let graph = chart.enter().append("g");

      let serie = graph.attr("class", "serie")
        .attr("data-assistance", d => d.key)
        .attr("fill", d => z(d.key));

      let rect = serie.selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", d => x(d.data.values[0].value.year) + (x.bandwidth() / 4); )
        .attr("y", d => y(d[1]))
        .style("cursor", "pointer")
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth() / 2);

      buildAxis();
      buildTooltip(rect);
    }

    function buildAxis() {
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
        .tickPadding(5);
      ;

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

    function buildTooltip(rect) {
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
        .on("mousemove", function (d) {
          if (tooltip) {
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
        .keys(d => {
          d.forEach(e => {
            e.values.forEach(el => {
              stackKeys.add(el.key);
            });
          });
          return stackKeys.values();
        })
        .value((d, key, i, m) => {
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

    function actualOrEstimate(year: number): string {
      if (new Date(year, null).getFullYear() <= new Date().getFullYear()) {
        return "Actual Not Available"
      } else {
        return "Estimate Not Available";
      }
    }

    (function buildTable() {
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

      // Table: Assistance Details
      tbody.selectAll("tr")

        .data(function () {
          let obligationsArr = [];

          assistanceDetails.forEach(obligation => {

            let assistanceArr = [];
            let detailsArr = [];

            assistanceTotals.forEach(assistanceTotal => {
              if (assistanceTotal.key === obligation.key) {
                assistanceArr.push(`<span style=" background-color:` + z(obligation.key) + `;
                                                  border:1px solid #000; 
                                                  width: 10px; 
                                                  height: 10px; 
                                                  display: inline-block;">
                                    </span> ` + obligation.key + " Total");
                assistanceTotal.values.forEach(year => {
                  let yearTotal;
                  if (year.value.ena && !year.value.total) {
                    yearTotal = year.value.items > 1
                      ? !year.value.nsi ? actualOrEstimate(year.key) : "Not Available"
                      : actualOrEstimate(year.key);
                  } else if (year.value.nsi && !year.value.total) {
                    yearTotal = "Not Separately Identifiable";
                  } else {
                    yearTotal = d3.format("($,")(year.value.total);
                  }
                  assistanceArr.push(yearTotal);
                });
              }
            });

            obligation.values.forEach(info => {

              let explanation = "",
                obligationSet = d3.set(),
                amountArr = [],
                rowArr = [],
                obligationArr = [],
                explanationArr = [];

              info.values.forEach(year => {

                let innerArr = [];
                year.values.forEach((item, index) => {
                  let itemAmount;
                  if (item.explanation) {
                    explanation += "FY " + String(item.year).slice(2, 4) +
                      " Exp: " + item.explanation + ", ";
                      explanationArr[index] = explanationArr[index] || [];
                      explanationArr[index] = explanation;
                  }

                  if (item.ena && !item.amount) {
                    itemAmount = actualOrEstimate(item.year);
                  } else if (item.nsi && !item.amount) {
                    itemAmount = "Not Separately Identifiable";
                  } else if(item.empty) {
                    itemAmount = "";
                  } else {
                    itemAmount = d3.format("($,")(item.amount);
                  }

                  innerArr.push(itemAmount);
                });
                amountArr.push(innerArr);
              });

              obligationSet.add(info.key + ( explanation ? "(" + explanation.slice(0, -2) + ")" : ""));

              amountArr.forEach(item => {
                item.forEach((innerItem, index) => {
                  rowArr[index] = rowArr[index] || [];
                  rowArr[index].push(innerItem);
                });
              });

              obligationArr = obligationSet.values();

              // Fix duplicate optional information for the same obligation
              explanationArr.forEach((item, index) => {
                if(rowArr.length > obligationArr.length){
                  obligationArr.forEach((innerItem, innerIndex) => {
                    if(String(innerItem).indexOf(item.slice(0,-2)) !== -1){
                      if(index !== innerIndex){
                        obligationArr[index] = innerItem;
                        obligationArr[innerIndex] = "";
                      } else {
                        obligationArr.push("");
                      }
                    }
                  });
                }
              });

              rowArr.forEach((item, index) => {
                item.unshift(obligationArr[index] === ""
                  ? ""
                  : obligationArr[index]
                  ? obligationArr[index]
                  : obligationArr[0]);
              });

              if (rowArr.length === 1 && rowArr[0][0] === ""  && detailsArr.length === 0) {
                // if there is one obligation with empty name
                // don't added it to the array
              } else {
                detailsArr.push(rowArr);
              }

            });

            detailsArr = _.flatten(detailsArr);
            detailsArr.unshift(assistanceArr);

            obligationsArr.push(detailsArr);

          });

          let obligationsData = _.flatten(obligationsArr);

          return obligationsData;
        })
        .enter().append("tr")
        .selectAll("tr")
        .data(d => d)
        .enter()
        .append("td")
        .html(function (d) {
          if (String(d).indexOf("Total") !== -1) {
            d3.select(this.parentNode).style("font-weight", "700");
          }
          return d;
        });

      // Table Totals
      tbody.append("tr")
        .attr("class", "totals")
        .style("font-weight", "700")
        .append("td")
        .text("Totals");

      tbody.select("tr:last-child")
        .selectAll("tr")
        .data(vizTotals)
        .enter()
        .append("td")
        .html(d => {
          let totalAmountIsZero = (d.value.total == 0) ? true : false;
          let enaANDnsi = (d.value.ena && d.value.nsi) ? true : false;
          let enaORnsi = (d.value.ena || d.value.nsi) ? true : false;

          if (enaANDnsi && totalAmountIsZero) {
            return "Not Available";
          }
          if (enaORnsi && totalAmountIsZero) {
            return !d.value.ena ? "Not Separately Identifiable" : actualOrEstimate(d.key);
          }
          if (enaORnsi && !totalAmountIsZero) {
            // Add asterix to the bar chart
            d3.select(".serie").append("text")
              .attr("x", function(){
                if(x(formatYear(d.key, false))){
                  return x(formatYear(d.key, false)) + (x.bandwidth() / 4) + (x.bandwidth() / 2);
                }else{
                  return x(formatYear(d.key, true)) + (x.bandwidth() / 4) + (x.bandwidth() / 2);
                }
              })
              .attr("y", function(){
                return y(d.value.total) + 20;
              })
              .text("*")
              .style("font-size", "40px")
              .style("color", "black");

            if(d3.select("#visualization em").empty()){
              d3.select("#visualization")
                .append("em")
                .style("display", "block")
                .style("text-align", "right")
                .html("<strong>*</strong> The totals shown do not include any amounts that are unidentifiable or unavailable");
            }

            return d3.format("($,")(d.value.total) + "*";
          }

          return d3.format("($,")(d.value.total);
        });
    })();

  }

  prepareVisualizationData() {
    let self = this;
    let formattedFinancialData = [];
    let obligations = d3.map();
    let numberOfYears = 3;
    let existingYears;
    let missingYears;
    let allYears = d3.set();

    function getAssistanceType(id): string {
      let result = self.FilterMultiArrayObjectPipe.transform([id], self.dictionaries.assistance_type, 'element_id', true, 'elements');
      return (result instanceof Array && result.length > 0) ? result[0].value : [];
    }

    // Find all available years
    this.financialData.map(function(item){
      for(let value of item.values){
        allYears.add(value.year);
      }
    });

    // If a year its missing
    this.financialData.map(function(item){
      existingYears = [];
      for(let value of item.values){
        existingYears.push(value.year);
      }
      if(existingYears.length < numberOfYears){
        missingYears = _.difference(allYears.values(), existingYears);
        missingYears.forEach(missingYear => {
          item.values.push({ flag: 'empty', 'year': missingYear });
        });
      }
    });

    this.financialData.map(function (item) {
      for (let value of item.values) {
        let year = value.year;
        let obligation = "No Obligation";
        if (item.assistanceType && item.assistanceType.length > 0) {
          obligation = getAssistanceType(item.assistanceType);
        } else {
          for (let question of item.questions) {
            if (question.questionCode === "salary_or_expense" && question.flag === "yes") {
              obligation = "Salary or Expense";
              break;
            }
          }
        }

        obligations.set(obligation, obligations.get(obligation) ? obligations.get(obligation) + 1 : 1);

        let financialItem = {
          "obligation": obligation,
          "info": item.additionalInfo ? item.additionalInfo.content || "" : "",
          "year": +year,
          "amount": value["actual"] || value["estimate"] || 0,
          "estimate": !value["actual"],
          "ena": value.flag == "ena" || value.flag == "na" ? true : false,
          "nsi": value.flag == "nsi" || value.flag == "no" ? true : false,
          "empty": value.flag == "empty" ? true : false,
          "explanation": value.explanation || ""
        };
        formattedFinancialData.push(financialItem);
      }
    });

    formattedFinancialData.forEach(function (item) {
      item.quantity = obligations.get(item.obligation) / numberOfYears;
    });

    return formattedFinancialData;
  }
}
