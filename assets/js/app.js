$(document).ready( function () {
    const options = {
        ajax: {
            url: './trackers.json',
            dataSrc: 'trackers'
        },
        columns: [
            { data: 'Name' },
            { data: 'Abbreviation' },
            { data: 'Type' },
            { data: 'Codebase' },
            { data: 'Observatory Grade' },
            { data: 'Users' },
            { data: 'Torrents' },
            { data: 'Peers' },
            { data: 'Ratio' },
            { data: 'Ratio Diff' },
            { data: 'Freeleech' },
            { data: 'Points' },
            { data: 'Hit & Run' },
            { data: 'Birthdate' },
            { data: 'Join' },
            { data: 'Join Diff' },
            { data: 'Updated' },
        ],
        columnDefs: [
            {
                targets: [4, 8, 9, 10, 11, 12],
                render: function (data) {

                    const styleMap = {
                        'N/A': {
                            labelType: 'default',
                            style: 'color: #9b9b9b;'
                        },
                        'Easy': {
                            labelType: 'default',
                            style: 'color: #0FB492;'
                        },
                        'Medium': {
                            labelType: 'default',
                            style: 'color: #EE7E2A;'
                        },
                        'Hard': {
                            labelType: 'default',
                            style: 'color: #E64141;'
                        },
                        'Impossible': {
                            labelType: 'default',
                            style: 'color: #720f0f;'
                        },
                        'Yes': {
                            labelType: 'default',
                            style: 'color: #50992a;'
                        },
                        'No': {
                            labelType: 'default',
                            style: 'color: #a05262;'
                        },
                        'A +': {
                            labelType: 'success',
                            style: 'border: #0FB492 .5px solid; color: #9b9b9b;'
                        },
                        'A': {
                            labelType: 'success',
                            style: 'border: #0FB492 .5px solid; color: #9b9b9b;'
                        },
                        'A -': {
                            labelType: 'success',
                            style: 'border: #0FB492 .5px solid; color: #9b9b9b;'
                        },
                        'B +': {
                            labelType: 'primary',
                            style: 'border: #00AEC8 .5px solid; color: #9b9b9b;'
                        },
                        'B': {
                            labelType: 'primary',
                            style: 'border: #00AEC8 .5px solid; color: #9b9b9b;'
                        },
                        'B -': {
                            labelType: 'primary',
                            style: 'border: #00AEC8 .5px solid; color: #9b9b9b;'
                        },
                        'C +': {
                            labelType: 'warning',
                            style: 'border: #81519C .5px solid; color: #9b9b9b;'
                        },
                        'C': {
                            labelType: 'warning',
                            style: 'border: #81519C .5px solid; color: #9b9b9b;'
                        },
                        'C -': {
                            labelType: 'warning',
                            style: 'border: #81519C .5px solid; color: #9b9b9b;'
                        },
                        'D +': {
                            labelType: 'info',
                            style: 'border: #EE7E2A .5px solid; color: #9b9b9b;'
                        },
                        'D': {
                            labelType: 'info',
                            style: 'border: #EE7E2A .5px solid; color: #9b9b9b;'
                        },
                        'D -': {
                            labelType: 'info',
                            style: 'border: #EE7E2A .5px solid; color: #9b9b9b;'
                        },
                        'F': {
                            labelType: 'danger',
                            style: 'border: #E64141 .5px solid; color: #9b9b9b;'
                        }
                    };

                    const styles = styleMap[data] || {};

                    if (styles){
                        const labelType = styles.labelType || 'default';
                        const style = styles.style || '';

                        return `<span class="label label-${labelType}" style="background-color: rgba(26, 26, 26, 1); ${style}"> ${data} </span>`; 
                    }

                    return data;
                }
            }
        ],
        paging: false,
        responsive: true,
        fixedHeader: true,
        order: [[ 0, "asc" ]]
    };
    const table = $('#table').DataTable(options);
} );
