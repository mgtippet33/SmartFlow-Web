import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/api/http.service';

import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexTitleSubtitle,
    ApexPlotOptions,
    ApexDataLabels,
    ApexYAxis,
    ApexResponsive,
    ApexLegend,
    ApexFill
} from "ng-apexcharts";
import { CookieService } from 'src/app/services/cookie-service';
import { EventStatistic } from 'src/app/Models/event-statistic';
import { LocationStatistic } from 'src/app/Models/location-statistic';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type EventTopOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    title: ApexTitleSubtitle;
    plotOptions: ApexPlotOptions;
    dataLabels: ApexDataLabels;
};

export type LocationChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    responsive: ApexResponsive[];
    xaxis: ApexXAxis;
    legend: ApexLegend;
    fill: ApexFill;
    title: ApexTitleSubtitle;
};

@Component({
    selector: 'app-statistic-page',
    templateUrl: './statistic-page.component.html',
    styleUrls: ['./statistic-page.component.scss'],
    providers: [HttpService]
})
export class StatisticPageComponent implements OnInit {
    @ViewChild("chart") chart: ChartComponent;
    eventsTop: Partial<EventTopOptions>;
    locationChart: Partial<LocationChartOptions>;
    token: string;
    eventStatistics: Array<EventStatistic>;
    locationStatistics: Array<LocationStatistic>;

    constructor(private router: Router, private httpService: HttpService,
        public translate: TranslateService) { }

    ngOnInit(): void {
        this.token = CookieService.getCookie('JWT_token')
        if (this.token == null) { return }

        this.httpService.getEventStatistics(this.token).subscribe(
            (data: any) => {
                data = data['body'];
                var statistics = new Array<EventStatistic>();
                for (var i = 0; i < data.length; ++i) {
                    var statistic = new EventStatistic();
                    statistic.event_id = data[i]['eventID'];
                    statistic.event_name = data[i]['eventName'];
                    statistic.all_visits = data[i]['allVisits'];
                    statistics.push(statistic);
                }

                this.eventStatistics = statistics;
                this.initializeEventsTop();
            }
        );

        this.initializeEmptyLocationChart();
    }

    private initializeEventsTop() {
        var visitDatas = Array<number>();
        var eventNames = Array<string>();

        for (var i = 0; i < this.eventStatistics.length; ++i) {
            var statistic = this.eventStatistics[i];
            visitDatas.push(statistic.all_visits);
            eventNames.push(statistic.event_name);
        }

        this.eventsTop = {
            series: [
                {
                    name: "Visits",
                    data: visitDatas
                }
            ],
            chart: {
                type: "bar",
                width: 650,
                height: 350
            },
            title: {
                text: "Attending Events",
                style: {
                    fontSize: "20px",
                }
            },
            plotOptions: {
                bar: {
                    horizontal: true
                }
            },
            dataLabels: {
                enabled: false
            },
            yaxis: {
                labels: {
                    style: {
                        fontSize: "17px",
                    },
                },
            },
            xaxis: {
                labels: {
                    style: {
                        fontSize: "17px",
                    },
                },
                categories: eventNames
            }
        };
    }

    private initializeLocationStatistics(eventID: number) {
        this.httpService.getLocationStatisticsByEvent(this.token, eventID).subscribe(
            (data: any) => {
                data = data['body'];
                var eventName;
                var statistics = new Array<LocationStatistic>();
                for (var i = 0; i < data.length; ++i) {
                    var statistic = new LocationStatistic();
                    statistic.location_id = data[i]['locationID'];
                    statistic.location_name = data[i]['locationName'];
                    statistic.visits = data[i]['visits'];
                    var date = data[i]['dateVisits'].split("T")[0];
                    if (this.translate.currentLang == 'en') {
                        statistic.date = formatDate(date, 'MM/dd/yyyy', 'en-US');
                    }
                    else {
                        statistic.date = formatDate(date, 'dd/MM/yyyy', 'en-US');
                    }
                    statistics.push(statistic);

                }

                this.locationStatistics = statistics;
                this.initializeLocationChart();
            }
        );
    }

    private initializeEmptyLocationChart() {
        this.locationChart = {
            series: [],
            chart: {
                type: "bar",
                width: 600,
                height: 350,
                stacked: true,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true
                }
            },
            title: {
                text: "Visiting event locations",
                style: {
                    fontSize: "20px",
                }
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: "bottom",
                            offsetX: -10,
                            offsetY: 0
                        }
                    }
                }
            ],
            plotOptions: {
                bar: {
                    horizontal: false
                }
            },
            xaxis: {
                type: "category",
                categories: []
            },
            legend: {
                position: "right",
                offsetY: 40
            },
            fill: {
                opacity: 1
            }
        };
    }

    private initializeLocationChart() {
        var dates = new Array<string>();
        var series = new Map<string, Array<any>>();
        for (var i = 0; i < this.locationStatistics.length; ++i) {
            var statistic = this.locationStatistics[i];
            if (series.has(statistic.location_name)) {
                var data = series.get(statistic.location_name);
                data.push(statistic.visits);
                series.set(statistic.location_name, data);
            }
            else {
                series.set(statistic.location_name, [statistic.visits])
            }

            if (!dates.find(date => date == statistic.date)) {
                dates.push(statistic.date);
            }
        }

        this.locationChart = {
            series: [],
            chart: {
                type: "bar",
                width: 600,
                height: 350,
                stacked: true,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true
                }
            },
            title: {
                text: "Visiting event locations",
                style: {
                    fontSize: "20px",
                }
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: "bottom",
                            offsetX: -10,
                            offsetY: 0
                        }
                    }
                }
            ],
            plotOptions: {
                bar: {
                    horizontal: false
                }
            },
            xaxis: {
                type: "category",
                categories: dates
            },
            legend: {
                position: "right",
                offsetY: 40
            },
            fill: {
                opacity: 1
            }
        };

        for (const [key, value] of series) {
            this.locationChart.series.push(
                {
                    name: key,
                    data: value
                }
            );
        }
    }

    onChange(value: any) {
        console.log(value);
        this.initializeLocationStatistics(value);
    }

}
