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
                    if (data === 'Impossible') {
                        return '<span class="label label-default" style="background-color: rgba(26, 26, 26, 1); color: #720f0f;">' + data + '</span>';
                    }

                    if (data === 'Yes') {
                        return '<span class="label label-default" style="background-color: rgba(26, 26, 26, 1); color: #50992a;">' + data + '</span>';
                    }
                    if (data === 'No') {
                        return '<span class="label label-default" style="background-color: rgba(26, 26, 26, 1); color: #a05262;">' + data + '</span>';
                    }

                    if (data === 'A +') {
                        return '<span class="label label-success" style="background-color: rgba(26, 26, 26, 1);border: #0FB492 .5px solid;color: #9b9b9b;">' + data + '</span>';
                    }
                    if (data === 'A') {
                        return '<span class="label label-success" style="background-color: rgba(26, 26, 26, 1);border: #0FB492 .5px solid;color: #9b9b9b;">' + data + '</span>';
                    }
                    if (data === 'A -') {
                        return '<span class="label label-success" style="background-color: rgba(26, 26, 26, 1);border: #0FB492 .5px solid;color: #9b9b9b;">' + data + '</span>';
                    }
                    if (data === 'B +') {
                        return '<span class="label label-primary" style="background-color: rgba(26, 26, 26, 1);border: #00AEC8 .5px solid;color: #9b9b9b;">' + data + '</span>';
                    }
                    if (data === 'B') {
                        return '<span class="label label-primary" style="background-color: rgba(26, 26, 26, 1);border: #00AEC8 .5px solid;color: #9b9b9b;">' + data + '</span>';
                    }
                    if (data === 'B -') {
                        return '<span class="label label-primary" style="background-color: rgba(26, 26, 26, 1);border: #00AEC8 .5px solid;color: #9b9b9b;">' + data + '</span>';
                    }
                    if (data === 'C +') {
                        return '<span class="label label-warning" style="background-color: rgba(26, 26, 26, 1);border: #81519C .5px solid;color: #9b9b9b;">' + data + '</span>';
                    }
                    if (data === 'C') {
                        return '<span class="label label-warning" style="background-color: rgba(26, 26, 26, 1);border: #81519C .5px solid;color: #9b9b9b;">' + data + '</span>';
                    }
                    if (data === 'C -') {
                        return '<span class="label label-warning" style="background-color: rgba(26, 26, 26, 1);border: #81519C .5px solid;color: #9b9b9b;">' + data + '</span>';
                    }
                    if (data === 'D +') {
                        return '<span class="label label-info" style="background-color: rgba(26, 26, 26, 1);border: #EE7E2A .5px solid;color: #9b9b9b;">' + data + '</span>';
                    }
                    if (data === 'D') {
                        return '<span class="label label-info" style="background-color: rgba(26, 26, 26, 1);border: #EE7E2A .5px solid;color: #9b9b9b;">' + data + '</span>';
                    }
                    if (data === 'D -') {
                        return '<span class="label label-info" style="background-color: rgba(26, 26, 26, 1);border: #EE7E2A .5px solid;color: #9b9b9b;">' + data + '</span>';
                    }
                    if (data === 'F') {
                        return '<span class="label label-danger" style="background-color: rgba(26, 26, 26, 1);border: #E64141 .5px solid;color: #9b9b9b;">' + data + '</span>';
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
