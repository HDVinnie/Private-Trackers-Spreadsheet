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
                targets: [7, 8, 9, 10, 11, 14],
                render: function (data) {
                    if (data === 'N/A') {
                        return '<span class="label label-default" style="background-color: rgba(26, 26, 26, 1); color: #9b9b9b;">' + data + '</span>';
                    }
                    if (data === 'Easy') {
                        return '<span class="label label-default" style="background-color: rgba(26, 26, 26, 1); color: #0FB492;">' + data + '</span>';
                    }
                    if (data === 'Medium') {
                        return '<span class="label label-default" style="background-color: rgba(26, 26, 26, 1); color: #EE7E2A;">' + data + '</span>';
                    }
                    if (data === 'Hard') {
                        return '<span class="label label-default" style="background-color: rgba(26, 26, 26, 1); color: #E64141;">' + data + '</span>';
                    }

                    if (data === 'Yes') {
                        return '<span class="label label-default" style="background-color: rgba(26, 26, 26, 1); color: #50992a;">' + data + '</span>';
                    }
                    if (data === 'No') {
                        return '<span class="label label-default" style="background-color: rgba(26, 26, 26, 1); color: #a05262;">' + data + '</span>';
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
