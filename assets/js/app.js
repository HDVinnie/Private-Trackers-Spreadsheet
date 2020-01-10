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
            { data: 'Points' },
            { data: 'Birthdate' },
            { data: 'Join' },
            { data: 'Join Diff' },
            { data: 'Updated' },
        ],
        columnDefs: [
            {
                targets: [8, 12],
                render: function (data) {
                    if (data === 'Easy') {
                        return '<span class="text-success">' + data + '</span>';
                    }
                    if (data === 'Medium') {
                        return '<span class="text-warning">' + data + '</span>';
                    }
                    if (data === 'Hard') {
                        return '<span class="text-danger">' + data + '</span>';
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
