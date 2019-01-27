(function (window) {
    window.__env = window.__env || {};

    // API url
    window.__env.engineRestUrl = 'http://63.33.201.166:8080/rest/';
    window.__env.engineApiUrl = 'http://63.33.201.166:8080/api/';
    window.__env.formioAppUrl = 'https://rllslkfteqdgmpv.form.io';
    window.__env.formioApiUrl = 'https://api.form.io';


    //Available Languages
    window.__env.languages = [
        { key: 'ar', lang: 'عربي' },
        { key: 'en', lang: 'English' },
    ];

    //Tasks - infiniteLoad PageSize
    window.__env.tasksPageSize = 10;

}(this));