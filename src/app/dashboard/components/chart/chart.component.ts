import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as Chart from 'chart.js';

/**
 *  Chart Component
 */
@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
})



export class ChartComponent implements OnInit {
    @Input() title: String;
    @Input() data: Object;
    @Input() options: String;
    @Input() chartType: Array<any>;
    @ViewChild('chart') chartElement?: ElementRef;
    chart;

    constructor(public translate: TranslateService) {
        Chart.pluginService.register({
            beforeRender: function (chart) {
                if (chart.config.options.showAllTooltips) {
                    // create an array of tooltips
                    // we can't use the chart tooltip because there is only one tooltip per chart
                    chart.pluginTooltips = [];
                    chart.config.data.datasets.forEach(function (dataset, i) {
                        chart.getDatasetMeta(i).data.forEach(function (sector, j) {
                            chart.pluginTooltips.push(new Chart.Tooltip({
                                _chart: chart.chart,
                                _chartInstance: chart,
                                _data: chart.data,
                                _options: chart.options.tooltips,
                                _active: [sector]
                            }, chart));
                        });
                    });

                    // turn off normal tooltips
                    chart.options.tooltips.enabled = false;
                }
            },
            afterDraw: function (chart, easing) {
                if (chart.config.options.showAllTooltips) {
                    // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
                    if (!chart.allTooltipsOnce) {
                        if (easing !== 1) {
                            return;
                        }
                        chart.allTooltipsOnce = true;
                    }

                    // turn on tooltips
                    chart.options.tooltips.enabled = true;
                    Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
                        tooltip.initialize();
                        tooltip.update();
                        // we don't actually need this since we are not animating tooltips
                        tooltip.pivot();
                        tooltip.transition(easing).draw();
                    });
                    chart.options.tooltips.enabled = false;
                }
            }
        });
    }
    ngOnInit(): void {
        if (this.chart) {
            this.chart.destroy();
        }
        // Clear out the element to render the new Chart.
        if (this.chartElement && this.chartElement.nativeElement) {
            this.chartElement.nativeElement.innerHTML = '';
        }
        this.chart = new Chart(this.chartElement ? this.chartElement.nativeElement : null, {
            type: this.chartType,
            data: this.data,
            options: this.options

        });

    }
}
