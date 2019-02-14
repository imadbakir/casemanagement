import { Component, OnInit } from '@angular/core';
import { RestService } from '../core/services/rest.service';
declare var palette: any;

/**
 * Dashboard Dashlet Main Component
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})



export class DashboardComponent implements OnInit {
  colors;
  themeColors = {
    primary: '#4d668c',
    secondary: '#e9a668',
    tertiary: '#a436ff',
    success: '#00c243',
    warning: '#ffc033',
    danger: '#f0201b',
    dark: '#222428',
    medium: '#989aa2',
    light: '#f9f9f9'

  };
  public charts;
  public casesDashletData = [];
  constructor(private restService: RestService) {
    this.colors = palette('rainbow', 12).map(function (hex) {
      return '#' + hex;
    });
  }

  fetchDashletData(params) {
    this.restService.getCases({ ...params }).subscribe(data => {
    this.casesDashletData = data;
    });
  }
  ngOnInit() {
    this.charts = {
      daily: [
        {
          title: 'Assigned Tasks',
          roles: [],
          options: {
            legend: {
              display: false
            },

            responsive: true,
            cutoutPercentage: 65
          },
          type: 'doughnut',
          data: {
            labels: ['Assigned Tasks'],
            datasets: [
              { data: [14], label: 'Assigned Tasks', backgroundColor: ['rgba(77, 102, 140, 0.8)'] },
            ]
          }

        },
        {
          title: 'Requests',
          roles: [],
          options: {
            legend: {
              display: false
            },

            responsive: true,
            cutoutPercentage: 70

          },
          type: 'doughnut',
          data: {
            labels: ['Requests'],
            datasets: [
              { data: [20], label: 'Requests', backgroundColor: ['rgba(77, 102, 140, 0.8)'] },
            ]
          }

        },
        {
          title: 'Completed Requests',
          roles: [],
          options: {
            legend: {
              display: false
            },

            responsive: true,
            cutoutPercentage: 70

          },
          type: 'doughnut',
          data: {
            labels: ['Completed Requests'],
            datasets: [
              { data: [24], label: 'Completed Requests', backgroundColor: ['rgba(0, 194, 67, 0.8)'] },
            ]
          }

        },
        {
          title: 'Completed Tasks',
          roles: [],
          options: {
            legend: {
              display: false
            },

            responsive: true,
            cutoutPercentage: 70

          },
          type: 'doughnut',
          data: {
            labels: ['Completed Tasks'],
            datasets: [
              { data: [10], label: 'Completed Tasks', backgroundColor: ['rgba(0, 194, 67, 0.8)'] },
            ]
          }

        },
        {
          title: 'Past due date',
          roles: [],
          options: {
            legend: {
              display: false
            },

            responsive: true,
            cutoutPercentage: 70

          },
          type: 'doughnut',
          data: {
            labels: ['Past due date'],
            datasets: [
              { data: [5], label: 'Past due date', backgroundColor: ['rgba(240, 32, 27, 0.8)'] },
            ]
          }

        }
      ],
      weeklyMonthly: [
        {
          title: 'New Requests',
          roles: [],
          options: {
            tooltips: {
              mode: 'index',
              intersect: false,
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
            legend: {
              display: true
            },
            title: {
              display: true,
              text: 'Within a week',
            },

            responsive: true,

          },
          type: 'line',
          data: {
            labels: ['1/1/2019', '2/1/2019', '3/1/2019', '4/1/2019', '5/1/2019', '6/1/2019', '7/1/2019'],
            datasets: [{
              label: 'Al-dammam',
              borderWidth: 1,
              data: [15, 2, 25, 15, 6, 55, 9],
              borderColor: this.colors[0],
              backgroundColor: this.colors[0],
              fill: false,
            }, {
              label: 'Al-riyad',
              borderWidth: 1,
              data: [5, 12, 35, 5, 16, 45, 3],
              borderColor: this.colors[1],
              backgroundColor: this.colors[1],
              fill: false,
            },
            {
              label: 'Jeddah',
              borderWidth: 1,
              data: [9, 22, 15, 15, 26, 25, 43],
              borderColor: this.colors[2],
              backgroundColor: this.colors[2],
              fill: false
            },
            {
              label: 'Alshamal',
              borderWidth: 1,
              data: [4, 2, 35, 4, 26, 35, 13],
              borderColor: this.colors[3],
              backgroundColor: this.colors[3],
              fill: false
            }]

          }
        },
        {
          title: 'New Tasks',
          roles: [],
          options: {
            tooltips: {
              mode: 'index',
              intersect: false,
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
            legend: {
              display: true
            },
            title: {
              display: true,
              text: 'Within a week',
            },

            responsive: true,

          },
          type: 'line',
          data: {
            labels: ['1/1/2019', '2/1/2019', '3/1/2019', '4/1/2019', '5/1/2019', '6/1/2019', '7/1/2019'],
            datasets: [{
              label: 'Al-dammam',
              borderWidth: 1,
              data: [15, 2, 25, 15, 6, 55, 9],
              backgroundColor: this.colors[0],
              borderColor: this.colors[0],
              fill: false,
            }, {
              label: 'Al-riyad',
              borderWidth: 1,
              data: [5, 12, 35, 5, 16, 45, 3],
              backgroundColor: this.colors[1],
              borderColor: this.colors[1],
              fill: false,
            },
            {
              label: 'Jeddah',
              borderWidth: 1,
              data: [9, 22, 15, 15, 26, 25, 43],
              backgroundColor: this.colors[2],
              borderColor: this.colors[2],
              fill: false,
            },
            {
              label: 'Alshamal',
              borderWidth: 1,
              data: [4, 2, 35, 4, 26, 35, 13],
              backgroundColor: this.colors[3],
              borderColor: this.colors[3],
              fill: false,
            }]

          }
        },
        {
          title: 'Requests Count',
          roles: [],
          options: {
            tooltips: {
              mode: 'index',
              intersect: false,
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
            legend: {
              display: true
            },
            title: {
              display: true,
              text: 'Within a week',
            },

            responsive: true,

          },
          type: 'line',
          data: {
            labels: ['1/1/2019', '2/1/2019', '3/1/2019', '4/1/2019', '5/1/2019', '6/1/2019', '7/1/2019'],
            datasets: [{
              label: 'New',
              borderWidth: 1,
              data: [15, 2, 25, 15, 6, 55, 9],
              borderColor: this.themeColors['warning'],
              backgroundColor: this.themeColors['warning'],
              fill: false,
            }, {
              label: 'Late',
              borderWidth: 1,
              data: [5, 12, 35, 5, 16, 45, 3],
              borderColor: this.themeColors['danger'],
              backgroundColor: this.themeColors['danger'],
              fill: false,
            },
            {
              label: 'Completed',
              borderWidth: 1,
              data: [9, 22, 15, 15, 26, 25, 43],
              borderColor: this.themeColors['success'],
              backgroundColor: this.themeColors['success'],
              fill: false,
            },
            {
              label: 'In Progress',
              borderWidth: 1,
              data: [4, 2, 35, 4, 26, 35, 13],
              borderColor: this.themeColors['primary'],
              backgroundColor: this.themeColors['primary'],
              fill: false
            }]

          }
        },
        {
          title: 'Tasks Count',
          roles: [],
          options: {
            tooltips: {
              mode: 'index',
              intersect: false,
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
            legend: {
              display: true
            },
            title: {
              display: true,
              text: 'Within a week',
            },

            responsive: true,

          },
          type: 'line',
          data: {
            labels: ['1/1/2019', '2/1/2019', '3/1/2019', '4/1/2019', '5/1/2019', '6/1/2019', '7/1/2019'],
            datasets: [{
              label: 'Late',
              borderWidth: 1,
              data: [5, 12, 35, 5, 16, 45, 3],
              borderColor: this.themeColors['danger'],
              backgroundColor: this.themeColors['danger'],
              fill: false
            },
            {
              label: 'Completed',
              borderWidth: 1,
              data: [9, 22, 15, 15, 26, 25, 43],
              borderColor: this.themeColors['success'],
              backgroundColor: this.themeColors['success'],
              fill: false
            },
            {
              label: 'In Progress',
              borderWidth: 1,
              data: [4, 2, 35, 4, 26, 35, 13],
              borderColor: this.themeColors['primary'],
              backgroundColor: this.themeColors['primary'],
              fill: false
            }]

          }
        },
        {
          title: 'Tasks Count',
          roles: [],
          options: {
            legend: {
              display: true
            },
            elements: {
              point: {
                pointStyle: 'circle'
              }
            },
            title: {
              display: true,
              text: 'Within a week',
            },
            responsive: true,
            tooltips: {
              mode: 'index',
              intersect: false,
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
            scales: {
              xAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Day'
                }
              }],
              yAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Count'
                }
              }]
            }
          },
          type: 'line',
          data: {
            labels: ['1/1/2019', '2/1/2019', '3/1/2019', '4/1/2019', '5/1/2019', '6/1/2019', '7/1/2019'],
            datasets: [{
              label: 'Late',
              fill: false,
              borderWidth: 1,
              data: [5, 12, 35, 5, 16, 45, 3],
              backgroundColor: this.themeColors['danger'],
              borderColor: this.themeColors['danger'],
            },
            {
              label: 'Completed',
              fill: false,
              borderWidth: 1,
              data: [9, 22, 15, 15, 26, 25, 43],
              backgroundColor: this.themeColors['success'],
              borderColor: this.themeColors['success'],
            },
            {
              label: 'In Progress',
              fill: false,
              borderWidth: 1,
              data: [4, 2, 35, 4, 26, 35, 13],
              backgroundColor: this.themeColors['primary'],
              borderColor: this.themeColors['primary'],
            }]

          }
        },
      ],
      total: [
        {
          title: 'Tasks',
          roles: [],
          options: {
            showAllTooltips: true,
            responsive: true,
            tooltips: {
              enabled: true,
              callbacks: {
                label: function (tooltipItem, data) {
                  const label = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || '';
                  return label;
                }
              }
            }
          },
          type: 'pie',
          data: {
            datasets: [{
              data: [15, 2, 25, 15],
              backgroundColor: [this.themeColors['warning'],
              this.themeColors['danger'], this.themeColors['success'], this.themeColors['primary']]
            }],
            labels: ['Machinery Selection', 'Contract Signing', 'Site Seeing', 'Engineer Review']



          }
        },
        {
          title: 'Total Tasks Count',
          roles: [],
          options: {
            showAllTooltips: true,
            responsive: true,
            tooltips: {
              enabled: true,
              callbacks: {
                label: function (tooltipItem, data) {
                  const label = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || '';
                  return label;
                }
              }
            }
          },
          type: 'pie',
          data: {
            datasets: [{
              data: [15, 25],
              backgroundColor: [
                this.themeColors['danger'], this.themeColors['primary']]
            }],
            labels: ['Late', 'Assigned']
          }
        },
        {
          title: 'Requests Count',
          roles: [],
          options: {
            showAllTooltips: true,
            responsive: true,
            tooltips: {
              enabled: true,
              callbacks: {
                label: function (tooltipItem, data) {
                  const label = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || '';
                  return label;
                }
              }
            }
          },
          type: 'pie',
          data: {
            datasets: [{
              data: [15, 2, 25, 15],
              backgroundColor: [this.themeColors['warning'],
              this.themeColors['danger'], this.themeColors['success'], this.themeColors['primary']]
            }],
            labels: ['New', 'Late', 'Completed', 'In Progress']



          }
        },
        {
          title: 'Tasks Count',
          roles: [],
          options: {
            showAllTooltips: true,
            responsive: true,
            tooltips: {
              enabled: true,
              callbacks: {
                label: function (tooltipItem, data) {
                  const label = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || '';
                  return label;
                }
              }
            }
          },
          type: 'pie',
          data: {
            datasets: [{
              data: [2, 25, 15],
              backgroundColor: [
                this.themeColors['danger'], this.themeColors['success'], this.themeColors['primary']]
            }],
            labels: ['Late', 'Completed', 'In Progress']
          }
        },
        {
          title: 'Productivity',
          roles: [],
          options: {
            showAllTooltips: true,
            responsive: true,
            tooltips: {
              enabled: true,
              callbacks: {
                label: function (tooltipItem, data) {
                  const label = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || '';
                  return label;
                }
              }
            }
          },
          type: 'pie',
          data: {
            datasets: [{
              data: [15, 5, 25, 20],
              backgroundColor: [this.themeColors['warning'],
              this.themeColors['danger'], this.themeColors['success'], this.themeColors['primary']]
            }],
            labels: ['Al-dammam', 'Al-riyad', 'Jeddah', 'Al-shamal']



          }
        },
      ],
      toBeLate: [
        {
          title: 'Tasks Count',
          roles: [],
          options: {
            showAllTooltips: true,
            legend: {
              display: false
            },
            elements: {
              point: {
                pointStyle: 'triangle'
              }
            },
            title: {
              display: false,
              text: 'Within a week',
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const label = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || '';
                  return label;
                },
                title: function (tooltipItem, data) {
                  return '';
                }
              }
            },
            responsive: true,

            scales: {
              xAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Day'
                }
              }],
              yAxes: [{
                ticks: {
                  min: 0,
                  stepSize: 10
                },
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Count'
                }
              }]
            }
          },
          type: 'line',
          data: {
            labels: ['1/1/2019', '2/1/2019', '3/1/2019', '4/1/2019'],
            datasets: [{
              label: 'Late',
              fill: false,
              borderWidth: 2,
              data: [5, 24, 10, 15],
              backgroundColor: this.themeColors['danger'],
              borderColor: this.themeColors['danger'],
            }]

          }
        },
      ]
    };
  }
}
