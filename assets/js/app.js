$(document).ready( function () {
    // Push empty '-' cells to bottom when sorting
    const namesType = $.fn.dataTable.absoluteOrder( [
        { value: '-', position: 'bottom' }
    ] );

    const numbersType = $.fn.dataTable.absoluteOrderNumber( [
        { value: '-', position: 'bottom' }
    ] );

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
                targets: [4, 8, 9, 10, 11, 12, 15],
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
                        'Moderate': {
                            labelType: 'default',
                            style: 'color: #EE7E2A;'
                        },
                        'Tough': {
                            labelType: 'default',
                            style: 'color: #E64141;'
                        },
                        'Unreasonable': {
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

                    const styles = styleMap[data];

                    if (styles){
                        const labelType = styles.labelType || 'default';
                        const style = styles.style || '';
                        return `<span class="label label-${labelType}" style="background-color: rgba(26, 26, 26, 1); ${style}"> ${data} </span>`;
                    }

                    return data;
                }
            },
            {
                // Sort by descending first for Users, Torrents, Peers and Updated
                targets: [5, 6, 7, 16],
                orderSequence: [ "desc", "asc" ]
            },
            {
                targets: [5, 6, 7],
                type: numbersType
            },
            {
                targets: [1, 3, 4, 8, 9, 10, 11, 12, 13, 14, 15],
                type: namesType
            },
            {
                targets: [1, 3, 4, 8, 9, 10, 11, 12, 13, 15, 16],
                className: 'dt-center'
            }
        ],
        paging: false,
        responsive: true,
        fixedHeader: true,
        order: [[ 0, "asc" ]]
    };
    const table = $('#table').DataTable(options);


    const options2 = {
        ajax: {
            url: './trackers2.json',
            dataSrc: 'trackers'
        },
        columns: [
            { data: 'name' },
            { data: 'description' },
            { data: 'type' },
        ],
        paging: false,
        responsive: true,
        fixedHeader: true,
        order: [[ 0, "asc" ]]
    };
    const table2 = $('#table2').DataTable(options2);
} );
