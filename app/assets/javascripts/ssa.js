//This gets applied as the 'onchange' method to the 'assessment' checkboxes
//Look at the values for that particular section, and asssign an appropriate rating
var Crunch = function(selector,start,middle,end) {
    start = typeof start !== 'undefined' ? start : 1;
    middle = typeof middle !== 'undefined' ? middle: 1;
    end = typeof end !== 'undefined' ? end : 1;
    /* Calculate full sections */
    totalfull = 0;
    totalpartial = 0;
    localscore = 0;
    localcount = 0;
    for(var i = 1; i < start; i++) {
        if ($('input#'+selector+i+'-check').prop('checked')) {
            localscore++;
        }
        localcount++;
    }
    if (localscore == localcount) {
        totalfull++;
    } else if (localscore > 0) {
        totalpartial++;
    }
    localscore = 0;
    localcount = 0;
    for (var i = start; i < middle; i++) {
        if ($('input#'+selector+i+'-check').prop('checked')) {
            localscore++;
        }
        localcount++;
    }
    if (localscore == localcount) {
        totalfull++;
    } else if (localscore > 0) {
        totalpartial++;
    }
    localscore = 0;
    localcount = 0;
    for (var i = middle; i <= end; i++) {
        if ($('input#'+selector+i+'-check').prop('checked')) {
            localscore++;
        }
        localcount++;
    }
    if (localscore == localcount) {
        totalfull++;
    } else if (localscore > 0) {
        totalpartial++;
    }

    output = "";
    if (totalpartial > 0) {
        output = totalfull + "+";
    } else {
        output = totalfull;
    }

    $('#'+selector+'-rating').text(output);
    chartvals[selector+'c'] = output;

    //Now that the DOM is updated, lets look at maintaining state

    if (StateChecker() == null) {
        //They've never configured how they maintain state, lets ask them!
        StateSetter();
    } else if (StateChecker() == 'cookies') {
        //Lets re-save this variable into the cookie
        SaveCookies();       
    } else if (StateChecker() == 'online') {
        //User is signed in - different logic a go go!
        //Which turns out to be nothing because this is all asynchronous black majik
    }
};

//This simply updates all the assessment checkboxes and applies the Crunch method to the onchange events.
//You can see that Crunch takes the section label, and three values. These are used to determine the split
//between 0, 0+, 1, 1+, 2, 2+, 3
var MakeCheckboxesAwes = function() {
    $('input[id^="sm"]').change(function() {
        Crunch("sm",4,7,8);
    });
    $('input[id^="pc"]').change(function() {
        Crunch("pc",3,5,6);
    });
    $('input[id^="eg"]').change(function() {
        Crunch("eg",3,5,6);
    });
    $('input[id^="ta"]').change(function() {
        Crunch("ta",3,6,7);
    });
    $('input[id^="sr"]').change(function() {
        Crunch("sr",3,5,6);
    });
    $('input[id^="sa"]').change(function() {
        Crunch("sa",3,5,6);
    });
    $('input[id^="dr"]').change(function() {
        Crunch("dr",3,5,6);
    });
    $('input[id^="cr"]').change(function() {
        Crunch("cr",3,5,6);
    });
    $('input[id^="st"]').change(function() {
        Crunch("st",4,6,7);
    });
    $('input[id^="vm"]').change(function() {
        Crunch("vm",4,6,7);
    });
    $('input[id^="eh"]').change(function() {
        Crunch("eh",3,5,6);
    });
    $('input[id^="oe"]').change(function() {
        Crunch("oe",3,5,6);
    });
};

//Convert the string rating score into an int
var ConvertValsToRaw = function(val) {
    switch(val.toString())
    {
        case "0":
            return 0;
            break;
        case "0+":
            return 1;
            break;
        case "1":
            return 2;
            break;
        case "1+":
            return 3;
            break;
        case "2":
            return 4;
            break;
        case "2+":
            return 5;
            break;
        case "3":
            return 6;
            break;
        default:
            return 0;
            break;
    };
};

//Convert a raw int into the string rating
var ConvertRawToVals = function(raw) {
    switch(raw)
    {
        case 0:
            return "0";
            break;
        case 1:
            return "0+";
            break;
        case 2:
            return "1";
            break;
        case 3:
            return "1+";
            break;
        case 4:
            return "2";
            break;
        case 5:
            return "2+";
            break;
        case 6:
            return "3";
            break;
        default:
            return "0";
            break;
    };
};

//Update the chart with values and redraw it - zing!
var GoChartGo = function(somechart,sometitles,somevals) {
    rawvals = {
        smc: ConvertValsToRaw(somevals['smc']),
        smt: ConvertValsToRaw(somevals['smt']),
        pcc: ConvertValsToRaw(somevals['pcc']),
        pct: ConvertValsToRaw(somevals['pct']),
        egc: ConvertValsToRaw(somevals['egc']),
        egt: ConvertValsToRaw(somevals['egt']),
        tac: ConvertValsToRaw(somevals['tac']),
        tat: ConvertValsToRaw(somevals['tat']),
        src: ConvertValsToRaw(somevals['src']),
        srt: ConvertValsToRaw(somevals['srt']),
        sac: ConvertValsToRaw(somevals['sac']),
        sat: ConvertValsToRaw(somevals['sat']),
        drc: ConvertValsToRaw(somevals['drc']),
        drt: ConvertValsToRaw(somevals['drt']),
        crc: ConvertValsToRaw(somevals['crc']),
        crt: ConvertValsToRaw(somevals['crt']),
        stc: ConvertValsToRaw(somevals['stc']),
        stt: ConvertValsToRaw(somevals['stt']),
        vmc: ConvertValsToRaw(somevals['vmc']),
        vmt: ConvertValsToRaw(somevals['vmt']),
        ehc: ConvertValsToRaw(somevals['ehc']),
        eht: ConvertValsToRaw(somevals['eht']),
        oec: ConvertValsToRaw(somevals['oec']),
        oet: ConvertValsToRaw(somevals['oet'])
    };

    /* Chart */
    somechart = new Highcharts.Chart({
        chart: {
            renderTo: 'graphycontainer',
            type: 'bar',
            spacingRight: 30
        },
        credits: {
            enabled: false
        },
        title: {
            text: null
        },
        xAxis: {
            categories: [sometitles['smtitle'],
                sometitles['pctitle'],
                sometitles['egtitle'],
                sometitles['tatitle'],
                sometitles['srtitle'],
                sometitles['satitle'],
                sometitles['drtitle'],
                sometitles['crtitle'],
                sometitles['sttitle'],
                sometitles['vmtitle'],
                sometitles['ehtitle'],
                sometitles['oetitle']
            ] 
        },
        yAxis: {
            labels: {
                enabled: false
            },
            gridLineColor: 'white',
            title: null
        },
        legend: {
            enabled: false
        },
        tooltip: {
            formatter: function() {
                var s = '<b>' + this.x + '</b>';
                s += '<br /><b>Target:</b> ' + ConvertRawToVals(this.points[1].y);
                s += '<br /><b>Current:</b> ' + ConvertRawToVals(this.points[0].y);
                return s;
            },
            shared: true
        },
        series: [{
            name: sometitles['current'],
            dataLabels: {
                enabled: true,
                formatter: function() {
                    return this.point.name;
                }
            },
            data: [{
                name: "Current: " + somevals['smc'],
                color: '#00577C',
                y: rawvals['smc']
            },{
                name: "Current: " + somevals['pcc'],
                color: '#00577C',
                y: rawvals['pcc']
            },{
                name: "Current: " + somevals['egc'],
                color: '#00577C',
                y: rawvals['egc']
            },{
                name: "Current: " + somevals['tac'],
                color: '#803400',
                y: rawvals['tac']
            },{
                name: "Current: " + somevals['src'],
                color: '#803400',
                y: rawvals['src']
            },{
                name: "Current: " + somevals['sac'],
                color: '#803400',
                y: rawvals['sac']
            },{
                name: "Current: " + somevals['drc'],
                color: '#007F38',
                y: rawvals['drc']
            },{
                name: "Current: " + somevals['crc'],
                color: '#007F38',
                y: rawvals['crc']
            },{
                name: "Current: " + somevals['stc'],
                color: '#007F38',
                y: rawvals['stc']
            },{
                name: "Current: " + somevals['vmc'],
                color: '#840000',
                y: rawvals['vmc']
            },{
                name: "Current: " + somevals['ehc'],
                color: '#840000',
                y: rawvals['ehc']
            },{
                name: "Current: " + somevals['oec'],
                color: '#840000',
                y: rawvals['oec']
            }]
        }, {
            name: sometitles['target'],
            dataLabels: {
                enabled: true,
                formatter: function() {
                    return this.point.name;
                }
            },
            data: [{
                name: "Target: " + somevals['smt'],
                color: '#00577C',
                y: rawvals['smt']
            },{
                name: "Target: " + somevals['pct'],
                color: '#00577C',
                y: rawvals['pct']
            },{
                name: "Target: " + somevals['egt'],
                color: '#00577C',
                y: rawvals['egt']
            },{
                name: "Target: " + somevals['tat'],
                color: '#803400',
                y: rawvals['tat']
            },{
                name: "Target: " + somevals['srt'],
                color: '#803400',
                y: rawvals['srt']
            },{
                name: "Target: " + somevals['sat'],
                color: '#803400',
                y: rawvals['sat']
            },{
                name: "Target: " + somevals['drt'],
                color: '#007F38',
                y: rawvals['drt']
            },{
                name: "Target: " + somevals['crt'],
                color: '#007F38',
                y: rawvals['crt']
            },{
                name: "Target: " + somevals['stt'],
                color: '#007F38',
                y: rawvals['stt']
            },{
                name: "Target: " + somevals['vmt'],
                color: '#840000',
                y: rawvals['vmt']
            },{
                name: "Target: " + somevals['eht'],
                color: '#840000',
                y: rawvals['eht']
            },{
                name: "Target: " + somevals['oet'],
                color: '#840000',
                y: rawvals['oet']
            }]
        }]
    }); 
}; 

TargetOptionsDefault = {
    start: {
        smt: "3",
        pct: "3",
        egt: "3",
        tat: "3",
        srt: "3",
        sat: "3",
        drt: "3",
        crt: "3",
        stt: "3",
        vmt: "3",
        eht: "3",
        oet: "3"
    },
    independentsoftwarevendor: {
        smt: "3",
        pct: "2",
        egt: "3",
        tat: "2",
        srt: "3",
        sat: "1",
        drt: "2",
        crt: "3",
        stt: "2",
        vmt: "3",
        eht: "0",
        oet: "3"
    },
    onlineserviceprovider: {
        smt: "3",
        pct: "2",
        egt: "3",
        tat: "2",
        srt: "2",
        sat: "1",
        drt: "3",
        crt: "2",
        stt: "3",
        vmt: "2",
        eht: "3",
        oet: "2"
    },
    financialservicesorganisation: {
        smt: "3",
        pct: "3",
        egt: "3",
        tat: "3",
        srt: "3",
        sat: "3",
        drt: "2",
        crt: "3",
        stt: "2",
        vmt: "3",
        eht: "3",
        oet: "2"
    },
    governmentorganisation: {
        smt: "2",
        pct: "3",
        egt: "3",
        tat: "3",
        srt: "3",
        sat: "3",
        drt: "2",
        crt: "2",
        stt: "3",
        vmt: "3",
        eht: "3",
        oet: "3"
    }
};

//Clone the default options into the global TargetOptions
TargetOptions = $.extend({},TargetOptionsDefault);


//This is the method which stores the pre-canned target templates
var SelectTarget = function(businesstype) {

    if (businesstype === "_new_target_") {
        $('#newTargetModal').modal('show');
        $('#targetselectah').val('start');
    } else {
    
        chartvals['smt'] = TargetOptions[businesstype]['smt'];
        chartvals['pct'] = TargetOptions[businesstype]['pct'];
        chartvals['egt'] = TargetOptions[businesstype]['egt'];
        chartvals['tat'] = TargetOptions[businesstype]['tat'];
        chartvals['srt'] = TargetOptions[businesstype]['srt'];
        chartvals['sat'] = TargetOptions[businesstype]['sat'];
        chartvals['drt'] = TargetOptions[businesstype]['drt'];
        chartvals['crt'] = TargetOptions[businesstype]['crt'];
        chartvals['stt'] = TargetOptions[businesstype]['stt'];
        chartvals['vmt'] = TargetOptions[businesstype]['vmt'];
        chartvals['eht'] = TargetOptions[businesstype]['eht'];
        chartvals['oet'] = TargetOptions[businesstype]['oet'];

        GoChartGo(chart1,charttitles,chartvals);

        //Lets check how we're saving state yeah?
        if (StateChecker() == null) {
            //Nothing set yet, lets set it?
            StateSetter();
        } else if (StateChecker() == 'cookies') {
            //Save cookie
            SaveTargetCookie();
        }

        //Logic to provide modify/delete buttons
        if (!(TargetOptionsDefault.hasOwnProperty(businesstype))) {
            if ($('#target-edit').length == 0) {
                $('#targetselectah').parent().append('<button class="btn btn-small" id="target-edit" style="margin-bottom:10px;margin-left:5px">Edit</button><button class="btn btn-danger btn-small" id="target-delete" style="margin-bottom:10px;margin-left:5px">Delete</button>');
            }
        } else {
            $('#target-edit').remove();
            $('#target-delete').remove();
        }
    }
};

var DefaultAssessmentState = {
    'cr1':false,
    'cr2':false,
    'cr3':false,
    'cr4':false,
    'cr5':false,
    'cr6':false,
    'dr1':false,
    'dr2':false,
    'dr3':false,
    'dr4':false,
    'dr5':false,
    'dr6':false,
    'eg1':false,
    'eg2':false,
    'eg3':false,
    'eg4':false,
    'eg5':false,
    'eg6':false,
    'eh1':false,
    'eh2':false,
    'eh3':false,
    'eh4':false,
    'eh5':false,
    'eh6':false,
    'oe1':false,
    'oe2':false,
    'oe3':false,
    'oe4':false,
    'oe5':false,
    'oe6':false,
    'pc1':false,
    'pc2':false,
    'pc3':false,
    'pc4':false,
    'pc5':false,
    'pc6':false,
    'sa1':false,
    'sa2':false,
    'sa3':false,
    'sa4':false,
    'sa5':false,
    'sa6':false,
    'sm1':false,
    'sm2':false,
    'sm3':false,
    'sm4':false,
    'sm5':false,
    'sm6':false,
    'sm7':false,
    'sm8':false,
    'sr1':false,
    'sr2':false,
    'sr3':false,
    'sr4':false,
    'sr5':false,
    'sr6':false,
    'st1':false,
    'st2':false,
    'st3':false,
    'st4':false,
    'st5':false,
    'st6':false,
    'st7':false,
    'ta1':false,
    'ta2':false,
    'ta3':false,
    'ta4':false,
    'ta5':false,
    'ta6':false,
    'ta7':false,
    'vm1':false,
    'vm2':false,
    'vm3':false,
    'vm4':false,
    'vm5':false,
    'vm6':false,
    'vm7':false,
    'target':"start"
};

var CompareSyncedAssessment = function() {
    var output = false;
    $.each(['sm','pc','eg','ta','sr','sa','dr','cr','st','vm','eh','oe'], function(index,value) {
        $('input[id^="'+value+'"]').each(function(idx) {
            if ($(this).prop('checked') !== syncedAssessment[$(this)[0].id.replace("-check",'')]) {
                output = true;
            }

        });

    });

    if ($('#targetselectah').val() != syncedAssessment['target']) {
        output = true;
    }

    return output;
};

var timerFunction = function() {
    if (CompareSyncedAssessment()) {
        PushAssessment();
    } else {
        ssa_timer = window.setTimeout(timerFunction,5000); // go again will ya?
    }
};

//We use this so we can time it out - let the spinner go for half a second
var hideSpinner = function() {
    $('#spinnner').hide();
};

var PushAssessment = function() {
    $('#spinnner').show();
    var new_assessment = {}
    var requireconfirm = true;
    new_assessment['title'] = "default";
    new_assessment['target'] = $('#targetselectah').val();
    $.each(['sm','pc','eg','ta','sr','sa','dr','cr','st','vm','eh','oe'], function(index,value) {
        $('input[id^="'+value+'"]').each(function(idx) {
            new_assessment[$(this)[0].id.replace("-check",'')] = $(this).prop('checked');
            if ($(this).prop('checked') == true) {
                requireconfirm = false;
            }
        });
    });
    var push = true;    
    if (requireconfirm == true && new_assessment['target'] == "start") {
        push = confirm("Are you sure you want to save this assessment? This will save all values to their default.");
    }

    if (push) {
        var jxhr = $.post(pushURL,
            {
                authenticity_token: $('meta[name="csrf-token"]').attr('content'),
                assessment: new_assessment
            },
            function(data) {
                if (data['error'] == "error") {
                    //failed to push
                    syncedAssessment = new_assessment; //force this to NOT get an error when the reload call is executed
                    location.reload();
                } else {
                    window.setTimeout(hideSpinner,500);
                    //Lets update syncedAssessment shall we?
                    syncedAssessment = new_assessment;
                    ssa_timer = window.setTimeout(timerFunction,5000); // Go again yarh
                }
            },
            'json'
        )
        .error(function() {
            // window.setTimeout(hideSpinner,500);
            // ssa_timer = window.setTimeout(timerFunction,5000); // Go again yarh
            syncedAssessment = new_assessment; // As above - force this 
            location.reload();
        });
    } else {
        syncedAssessment = new_assessment; //Forces this to NOT alert on window reload
        location.reload();
    }

};

var LoadTargets = function(url) {
    var deferred = $.Deferred();
    var jxhr = $.get(url,
        function(data) {
            if (data['error'] == "error") {
                //console.log(data);
                deferred.reject();
            } else if (typeof data[0] == "undefined") {
                //console.log('undefined');
                $('#targetselectah option[value="_new_target_"]').remove();
                $('#targetselectah').append('<option value="_new_target_">* New Target</option>');
                deferred.resolve();
            } else {
                //console.log(data);
                $.each(data,function() {
                    //console.log($(this));
                    var title = "";
                    var shorttitle = "";
                    var new_target = {};
                    $.each($(this)[0], function(k,v) {
                        switch(k) {
                            case 'title': title = v; break;
                            case 'shorttitle': shorttitle = v; break;
                            case 'smt': new_target['smt'] = ConvertRawToVals(v); break;
                            case 'pct': new_target['pct'] = ConvertRawToVals(v); break;
                            case 'egt': new_target['egt'] = ConvertRawToVals(v); break;
                            case 'tat': new_target['tat'] = ConvertRawToVals(v); break;
                            case 'srt': new_target['srt'] = ConvertRawToVals(v); break;
                            case 'sat': new_target['sat'] = ConvertRawToVals(v); break;
                            case 'drt': new_target['drt'] = ConvertRawToVals(v); break;
                            case 'crt': new_target['crt'] = ConvertRawToVals(v); break;
                            case 'stt': new_target['stt'] = ConvertRawToVals(v); break;
                            case 'vmt': new_target['vmt'] = ConvertRawToVals(v); break;
                            case 'eht': new_target['eht'] = ConvertRawToVals(v); break;
                            case 'oet': new_target['oet'] = ConvertRawToVals(v); break;
                       }
                   });

                   TargetOptions[shorttitle] = new_target;

                   if ($('#targetselectah option[value="'+shorttitle+'"]').length == 0) {
                    $('#targetselectah').append('<option value="'+shorttitle+'">'+title+'</option>');
                   }

                   $('#targetselectah option[value="_new_target_"]').remove();
                   $('#targetselectah').append('<option value="_new_target_">* New Target</option>');

                   deferred.resolve();

                });
            }
        },
        'json'
    );
    return deferred.promise();
};

var LoadLatestAssessment = function(url,filter) {
    filter = typeof filter !== 'undefined' ? filter : "default";
    var deferred = $.Deferred();

    var jxhr = $.get(url,
        function(data) {
            if (data['error'] == "error") {
                //console.log({'error':'error'});
                syncedAssessment = DefaultAssessmentState; // This is in global scope
                deferred.reject();
            } else if (typeof data[0] == "undefined") {
                syncedAssessment = DefaultAssessmentState; // This is in global scope
                deferred.resolve();
            } else {
                //Update the output - if defined
                syncedAssessment = data[0];

                //Lets load up all this data huh?
                $.each(data[0], function(field,value) {
                    switch(field) {
                        case 'cr1': $('#cr1-check').prop('checked',value); $('#cr1-check').trigger('change'); break;
                        case 'cr2': $('#cr2-check').prop('checked',value); $('#cr2-check').trigger('change'); break;
                        case 'cr3': $('#cr3-check').prop('checked',value); $('#cr3-check').trigger('change'); break;
                        case 'cr4': $('#cr4-check').prop('checked',value); $('#cr4-check').trigger('change'); break;
                        case 'cr5': $('#cr5-check').prop('checked',value); $('#cr5-check').trigger('change'); break;
                        case 'cr6': $('#cr6-check').prop('checked',value); $('#cr6-check').trigger('change'); break;
                        case 'dr1': $('#dr1-check').prop('checked',value); $('#dr1-check').trigger('change'); break;
                        case 'dr2': $('#dr2-check').prop('checked',value); $('#dr2-check').trigger('change'); break;
                        case 'dr3': $('#dr3-check').prop('checked',value); $('#dr3-check').trigger('change'); break;
                        case 'dr4': $('#dr4-check').prop('checked',value); $('#dr4-check').trigger('change'); break;
                        case 'dr5': $('#dr5-check').prop('checked',value); $('#dr5-check').trigger('change'); break;
                        case 'dr6': $('#dr6-check').prop('checked',value); $('#dr6-check').trigger('change'); break;
                        case 'eg1': $('#eg1-check').prop('checked',value); $('#eg1-check').trigger('change'); break;
                        case 'eg2': $('#eg2-check').prop('checked',value); $('#eg2-check').trigger('change'); break;
                        case 'eg3': $('#eg3-check').prop('checked',value); $('#eg3-check').trigger('change'); break;
                        case 'eg4': $('#eg4-check').prop('checked',value); $('#eg4-check').trigger('change'); break;
                        case 'eg5': $('#eg5-check').prop('checked',value); $('#eg5-check').trigger('change'); break;
                        case 'eg6': $('#eg6-check').prop('checked',value); $('#eg6-check').trigger('change'); break;
                        case 'eh1': $('#eh1-check').prop('checked',value); $('#eh1-check').trigger('change'); break;
                        case 'eh2': $('#eh2-check').prop('checked',value); $('#eh2-check').trigger('change'); break;
                        case 'eh3': $('#eh3-check').prop('checked',value); $('#eh3-check').trigger('change'); break;
                        case 'eh4': $('#eh4-check').prop('checked',value); $('#eh4-check').trigger('change'); break;
                        case 'eh5': $('#eh5-check').prop('checked',value); $('#eh5-check').trigger('change'); break;
                        case 'eh6': $('#eh6-check').prop('checked',value); $('#eh6-check').trigger('change'); break;
                        case 'oe1': $('#oe1-check').prop('checked',value); $('#oe1-check').trigger('change'); break;
                        case 'oe2': $('#oe2-check').prop('checked',value); $('#oe2-check').trigger('change'); break;
                        case 'oe3': $('#oe3-check').prop('checked',value); $('#oe3-check').trigger('change'); break;
                        case 'oe4': $('#oe4-check').prop('checked',value); $('#oe4-check').trigger('change'); break;
                        case 'oe5': $('#oe5-check').prop('checked',value); $('#oe5-check').trigger('change'); break;
                        case 'oe6': $('#oe6-check').prop('checked',value); $('#oe6-check').trigger('change'); break;
                        case 'pc1': $('#pc1-check').prop('checked',value); $('#pc1-check').trigger('change'); break;
                        case 'pc2': $('#pc2-check').prop('checked',value); $('#pc2-check').trigger('change'); break;
                        case 'pc3': $('#pc3-check').prop('checked',value); $('#pc3-check').trigger('change'); break;
                        case 'pc4': $('#pc4-check').prop('checked',value); $('#pc4-check').trigger('change'); break;
                        case 'pc5': $('#pc5-check').prop('checked',value); $('#pc5-check').trigger('change'); break;
                        case 'pc6': $('#pc6-check').prop('checked',value); $('#pc6-check').trigger('change'); break;
                        case 'sa1': $('#sa1-check').prop('checked',value); $('#sa1-check').trigger('change'); break;
                        case 'sa2': $('#sa2-check').prop('checked',value); $('#sa2-check').trigger('change'); break;
                        case 'sa3': $('#sa3-check').prop('checked',value); $('#sa3-check').trigger('change'); break;
                        case 'sa4': $('#sa4-check').prop('checked',value); $('#sa4-check').trigger('change'); break;
                        case 'sa5': $('#sa5-check').prop('checked',value); $('#sa5-check').trigger('change'); break;
                        case 'sa6': $('#sa6-check').prop('checked',value); $('#sa6-check').trigger('change'); break;
                        case 'sm1': $('#sm1-check').prop('checked',value); $('#sm1-check').trigger('change'); break;
                        case 'sm2': $('#sm2-check').prop('checked',value); $('#sm2-check').trigger('change'); break;
                        case 'sm3': $('#sm3-check').prop('checked',value); $('#sm3-check').trigger('change'); break;
                        case 'sm4': $('#sm4-check').prop('checked',value); $('#sm4-check').trigger('change'); break;
                        case 'sm5': $('#sm5-check').prop('checked',value); $('#sm5-check').trigger('change'); break;
                        case 'sm6': $('#sm6-check').prop('checked',value); $('#sm6-check').trigger('change'); break;
                        case 'sm7': $('#sm7-check').prop('checked',value); $('#sm7-check').trigger('change'); break;
                        case 'sm8': $('#sm8-check').prop('checked',value); $('#sm8-check').trigger('change'); break;
                        case 'sr1': $('#sr1-check').prop('checked',value); $('#sr1-check').trigger('change'); break;
                        case 'sr2': $('#sr2-check').prop('checked',value); $('#sr2-check').trigger('change'); break;
                        case 'sr3': $('#sr3-check').prop('checked',value); $('#sr3-check').trigger('change'); break;
                        case 'sr4': $('#sr4-check').prop('checked',value); $('#sr4-check').trigger('change'); break;
                        case 'sr5': $('#sr5-check').prop('checked',value); $('#sr5-check').trigger('change'); break;
                        case 'sr6': $('#sr6-check').prop('checked',value); $('#sr6-check').trigger('change'); break;
                        case 'st1': $('#st1-check').prop('checked',value); $('#st1-check').trigger('change'); break;
                        case 'st2': $('#st2-check').prop('checked',value); $('#st2-check').trigger('change'); break;
                        case 'st3': $('#st3-check').prop('checked',value); $('#st3-check').trigger('change'); break;
                        case 'st4': $('#st4-check').prop('checked',value); $('#st4-check').trigger('change'); break;
                        case 'st5': $('#st5-check').prop('checked',value); $('#st5-check').trigger('change'); break;
                        case 'st6': $('#st6-check').prop('checked',value); $('#st6-check').trigger('change'); break;
                        case 'st7': $('#st7-check').prop('checked',value); $('#st7-check').trigger('change'); break;
                        case 'ta1': $('#ta1-check').prop('checked',value); $('#ta1-check').trigger('change'); break;
                        case 'ta2': $('#ta2-check').prop('checked',value); $('#ta2-check').trigger('change'); break;
                        case 'ta3': $('#ta3-check').prop('checked',value); $('#ta3-check').trigger('change'); break;
                        case 'ta4': $('#ta4-check').prop('checked',value); $('#ta4-check').trigger('change'); break;
                        case 'ta5': $('#ta5-check').prop('checked',value); $('#ta5-check').trigger('change'); break;
                        case 'ta6': $('#ta6-check').prop('checked',value); $('#ta6-check').trigger('change'); break;
                        case 'ta7': $('#ta7-check').prop('checked',value); $('#ta7-check').trigger('change'); break;
                        case 'vm1': $('#vm1-check').prop('checked',value); $('#vm1-check').trigger('change'); break;
                        case 'vm2': $('#vm2-check').prop('checked',value); $('#vm2-check').trigger('change'); break;
                        case 'vm3': $('#vm3-check').prop('checked',value); $('#vm3-check').trigger('change'); break;
                        case 'vm4': $('#vm4-check').prop('checked',value); $('#vm4-check').trigger('change'); break;
                        case 'vm5': $('#vm5-check').prop('checked',value); $('#vm5-check').trigger('change'); break;
                        case 'vm6': $('#vm6-check').prop('checked',value); $('#vm6-check').trigger('change'); break;
                        case 'vm7': $('#vm7-check').prop('checked',value); $('#vm7-check').trigger('change'); break;
                        case 'target': $('#targetselectah').val(value); $('#targetselectah').trigger('change'); break;
                    }
                });

                deferred.resolve();
            }
        },
        'json'
    );
    return deferred.promise();
};

//
var LoadCookies = function() { 
    //Lets check for previously set values via cookies and then update all the checks etc

    //Firstly lets get all the checks
    if ($.cookie('alltheoptions') != null) {

        //Therefore we have a previously set cookie! Lets update some shizzzzen

        //Iterate through the hash of options from the cookie
        $.each($.cookie('alltheoptions'), function(section,values) {

            //Each hash entry contains another hash of the checker id and value
            $.each(values, function(checker,value) {
                if (value == 1) {
                    $('#'+checker).prop('checked',true);
                } else {
                    $('#'+checker).prop('checked',false);
                };

                //Trigger the change event to update the rating
                $('#'+checker).trigger('change');

            });

        });
    };

    //Okay, lets check if we can update the target too
    if ($.cookie('targetoption') != null) {
        //Therefore we have a previously set cookie, lets update the graph target

        $('#targetselectah').val($.cookie('targetoption'));
        $('#targetselectah').trigger('change');
    };

};

// Call me to convert all the individual select boxes into some form of a hash
var SaveCookies = function() {

    //Logic to manage the checker options
    alltheoptions = {};
    smoption = {};

    $.each(['sm','pc','eg','ta','sr','sa','dr','cr','st','vm','eh','oe'], function(index,value) {
        tmpoption = {};
        $('input[id^="'+value+'"]').each(function(idx) {
            if ($(this).prop('checked') == true) {
                tmpoption[$(this).attr('id')] = 1;
            } else {
                tmpoption[$(this).attr('id')] = 0;
            };
        });

        alltheoptions[value] = tmpoption;

    });

    $.cookie('alltheoptions',alltheoptions);

};

// Call to save the target selectah id - I've split this, because otherwise I was having weird race conditions
var SaveTargetCookie = function() {

    //Logic to save the target selector state
    $.cookie('targetoption',$('#targetselectah').val());
}

//Function to tidy up some of the forms etc
// And sure, I'm similar to MakeCheckboxesAwes, but, whatever, this is my hacked together code
var ImSoPretty = function() {

    $('#loginModal').on('shown',function() {
        $('#user_email').focus();
    });

    $('#forgottenPasswordModal').on('shown',function() {
        $('#user_email').focus();
    });

    $('#registerModal').on('shown',function() {
        $('#user_email').focus();
    });

    $('#resendConfirmationModal').on('shown',function() {
        $('#user_email').focus();
    });

    $('#newTargetModal').on('show',function() {
        if (typeof($('#new-target-form')[0]) != "undefined") {
            $('#new-target-form')[0].reset();
        }
    });

    $('#newTargetModal').on('shown',function() {
        $('#target_title').focus();
    });

    $('#state-nothing').on('click',function() {
        $.cookie('statemethod','pleasedont');
        $.removeCookie('alltheoptions');
        $.removeCookie('targetoption');
        SetFooterContent("pleasedont");
        $('#stateModal').modal('hide');
    });

    $('#state-cookies').on('click',function() {
        $.cookie('statemethod','cookies');
        SaveCookies();
        SaveTargetCookie();
        SetFooterContent("cookies");
        $('#stateModal').modal('hide');
    });

    $('#state-db').on('click', function() {
        $('#stateModal').modal('hide');
        $('#loginModal').modal('show');
    });

    $('#bottomderp').on('click',function() {
        $('#stateModal').modal('show');
    });

    $('#scorecard > p').on('click','#target-delete',function() {
        var tmpval = $('#targetselectah').val();
        var jxhr = $.ajax({
            url: deleteTargetURL,
            type: 'DELETE',
            data: {
                authenticity_token: $('meta[name="csrf-token"]').attr('content'),
                target: tmpval
            },
            dataType: 'json',
            complete: function() {
                $('#targetselectah').val('start');
                $('#targetselectah').trigger('change');
                $('#targetselectah option[value="'+tmpval+'"]').remove();
                $('#targetselectah option[value="_new_target_"]').remove();
                $('#targetselectah').append('<option value="_new_target_">* New Target</option>');
            }
        });
    });

    $('#scorecard > p').on('click','#target-edit',function() {
        $('#editTargetModal').attr('data-remote',editTargetURLbase + "?title=" + $('#targetselectah').val());
        $('#editTargetModal').modal('show');
    });

    $('body').on('hidden','#editTargetModal', function() {
        $(this).removeData('modal');
    });

}

// Function to check how the user is maintaining state
var StateChecker = function() {

    return $.cookie('statemethod');

}

// Function to pop a dialog so we can figure out how they want to maintain state
var StateSetter = function() {
    $('#stateModal').modal('show');
}

