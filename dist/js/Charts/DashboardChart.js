
$(document).ready(function(){

        $.get('https://api.covid19india.org/data.json',function(data){

          var daily_con = [], dates = [], daily_act =[], daily_rec = [], daily_dec = [];
        
          var x =data.cases_time_series.length-28;
          for(var i=x;i<data.cases_time_series.length;i++){
            dates.push(new Date(data.cases_time_series[i].date));
            daily_con.push(data.cases_time_series[i].dailyconfirmed);
            daily_rec.push(data.cases_time_series[i].dailyrecovered);
          }

          DrawChart('#AllStateConf',dates,daily_con, "Daily Confirmed","blue");

          DrawChart('#AllStateRecv',dates,daily_rec, "Daily Recovered","green");
   
         });

        Chart.defaults.global.defaultFontFamily ='archia';
        Chart.defaults.global.defaultFontColor = 'black';
        Chart.defaults.global.defaultFontSize = 14;

        function DrawChart(id,labels,data,label,color){

          var ctx = $(id);
          var draw = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    label: label,
                    borderColor: 'blue' ,
                    backgroundColor: '#23c1bd',       
                    barThickness:10,
                    fill: false
                    
                }
                ]
            },
            options: {
                scales:{
                  xAxes:[{
                    type:'time',
                    time:{
                    unit:'week',
                    displayFormats: {
                     'millisecond': 'MMM DD',
                     'second': 'MMM DD',
                     'minute': 'MMM DD',
                     'hour': 'MMM DD',
                     'day': 'MMM DD',
                     'week': 'MMM DD',
                     'month': 'MMM DD',
                     'quarter': 'MMM DD',
                     'year': 'MMM DD',
                    }
                  }
                  }]
                }
            }
        });  
      }

      // table data

      var con = 0, act = 0, rec = 0, dea = 0, tcases = 0, acases = 0, rcases = 0, dcases = 0, mcases = 0, state = [], st_code = []; 

      $.get('https://api.covid19india.org/state_district_wise.json',function(data){
        
        var disp_data = '';
        var disp_row = '';
    
        $.each(data,function(key,value){
        
          state.push(state);
         
          $.each(value,function(key1,value1){
          disp_data = '';
          disp_row = '';

          if("statecode" !== key1){
          disp_data += '<div id='+value['statecode']+'>';
          disp_data += '<span>'+key+'</span><div class="table-split"></div>';
          disp_data += '<span></span><div class="table-split"></div>';
          disp_data += '<span></span><div class="table-split"></div>';
          disp_data += '<span></span><div class="table-split"></div>';
          disp_data += '<span></span><div class="table-split"></div>';

          disp_data += '<table style="display:none;"><tr>';
          disp_data += '<th>District</th>';
          disp_data += '<th style="color:blue";>Confirmed</th>';
          disp_data += '<th style="color:rgba(252,209,42,1)">Active</th>';
          disp_data += '<th style="color:rgba(40,167,69,.92)">Recovered</th>';
          disp_data += '<th style="color:rgba(255,7,58,.92)">Deacased</th>';
          disp_data += '</tr>';

          $.each(value1,function(key2,value2){

          disp_data += '<tr>';
          disp_data += '<td>'+key2+'</td>';
          disp_data += '<td>'+value2['confirmed']+'</td>';
          disp_data += '<td>'+value2['active']+'</td>';
          disp_data += '<td>'+value2['recovered']+'</td>';
          disp_data += '<td>'+value2['deceased']+'</td>';
          disp_data += '</tr>';
          
          con += value2['confirmed'];
          act += value2['active'];
          dea += value2['deceased'];
          rec += value2['recovered'];

          });

          disp_data += '</table></div>';
          $("#main_table").append(disp_data);

          var t = Number(con)-Number(rec)-Number(dea);

          $('#'+value['statecode']).find('span')[1].append(con);
          $('#'+value['statecode']).find('span')[2].append(t);
          $('#'+value['statecode']).find('span')[3].append(rec);
          $('#'+value['statecode']).find('span')[4].append(dea);

          if(mcases < con)
             mcases = con;
    
          tcases += con;
          acases += t;
          rcases += rec;
          dcases += dea;
          con = act = dea = rec = 0;  }
          
          else
            st_code[key]= value1;
        });
      });
         $('#conf').text(tcases); // total cases 
         $('#actv').text(acases); // total active
         $('#recv').text(rcases); // total recover
         $('#deac').text(dcases); // total death
         //console.log(mcases); // maximum cases(state level)
   });

     

   $(document).on('click','#main_table div',function(){  

        $(this).find('table').toggle();
        $('table').click(false);
     }); 

});


// remove background lines
// options: {
//     scales: {
//         xAxes: [{
//             gridLines: {
//                 drawOnChartArea: false
//             }
//         }],
//         yAxes: [{
//             gridLines: {
//                 drawOnChartArea: false
//             }
//         }]
//     }
// }