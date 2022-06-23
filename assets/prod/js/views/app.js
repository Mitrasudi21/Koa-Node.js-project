jQuery.fn.scrollTo=function(t){return $(this).scrollTop($(this).scrollTop()-$(this).offset().top+$(t).offset().top-45),this},$(function(){$(".ui.pointing.dropdown.link.item").dropdown()});var PHONE_VALIDATOR=/^[6-9]\d{9}$/;function toggleFilterView(){$("#invoiceFilters").transition({animation:"slide down"})}function initLogout(){$(".logout-modal").modal("show")}function initLogoutResponsive(){$(".dimmed").click(),setTimeout(initLogout,500)}document.addEventListener("visibilitychange",function(){});var BASE_URL=window.location.origin+"/",app=angular.module("app",["ui.router","ngAnimate","toastr","angularUtils.directives.dirPagination","selectize"]);app.factory("dataFactory",["$http","toastr",function(n,e){var t={toastSuccess:function(t){e.success(t,"")},toastError:function(t){e.error(t,"")},toastInfo:function(t){e.info(t,"")},get:function(t){return n.get(BASE_URL+t).then(function(t){return t.data})},post:function(t,e){return n.post(BASE_URL+t,e).then(function(t){return t.data})},put:function(t,e){return n.put(BASE_URL+t,e).then(function(t){return t.data})},delete:function(t){return n.delete(BASE_URL+t).then(function(t){return t.data})}};return t}]),app.run(["$rootScope",function(t){t.BASE_URL=BASE_URL}]),app.config(["toastrConfig",function(t){angular.extend(t,{autoDismiss:!1,closeButton:!0,containerId:"toast-container",maxOpened:0,newestOnTop:!0,positionClass:"toast-bottom-right",preventDuplicates:!1,preventOpenDuplicates:!1,target:"body"})}]),app.config(["$locationProvider",function(t){t.hashPrefix("")}]),app.config(["paginationTemplateProvider",function(t){t.setPath("/templates/dirPagination.tpl.html")}]),app.filter("isoDateFormat",function(){return function(t,e){try{return e=e||"DD-MM-YYYY HH:mm",moment(t).format(e)}catch(t){return""}}});var timeInMillsDate=new Date;app.filter("timeInMills",function(){return function(t){return t?(timeInMillsDate.setTime(14880474e5+t),moment(timeInMillsDate).format("hh:mm a")):"n/a"}}),app.config(["$provide",function(t){t.decorator("$state",["$delegate","$rootScope",function(r,t){return t.$on("$stateChangeStart",function(t,e,n){r.next=e,r.toParams=n}),r}])}]);var currImageId="",currUploadedFile=null;function processFileForUpload(t){try{var n=(t.target.files||t.dataTransfer.files||t.originalEvent.dataTransfer.files)[0];if(n){var e=(e=n.name.toUpperCase().split("."))[e.length-1];if(524288<n.size){if(!(0<=["JPG","JPEG"].indexOf(e)))return $("#proxy-err-msg").attr("data-msg","Please use a file smaller than 512kb"),void $("#proxy-err-msg").click();new Compressor(n,{quality:.7,maxWidth:1920,maxHeight:1080,success:function(t){var e=new File([t],n.name);$("#img-"+currImageId).attr("src",URL.createObjectURL(t)),currUploadedFile=e},error:function(t){$("#proxy-err-msg").attr("data-msg","Failed to process this file"),$("#proxy-err-msg").click()}})}var r=new FileReader;r.onload=function(t){$("#img-"+currImageId).attr("src",t.target.result),currUploadedFile=n},r.readAsDataURL(n),document.getElementById("invoice-thumbnail-upload").value=""}return}catch(t){}}function ExcelDateToJSDate(t){var e=Math.floor(t-25569),n=new Date(1e3*(86400*e)),r=t-Math.floor(t)+1e-7,e=Math.floor(86400*r),t=e%60;e-=t;r=Math.floor(e/3600),e=Math.floor(e/60)%60;return new Date(n.getFullYear(),n.getMonth(),n.getDate(),r,e,t)}function getUrlVars(){for(var t,e=[],n=window.location.href.slice(window.location.href.indexOf("?")+1).split("&"),r=0;r<n.length;r++)t=n[r].split("="),e.push(t[0]),e[t[0]]=t[1];return e}function toTitleCase(t){return t.replace(/\w\S*/g,function(t){return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase()})}function isValidDate(t){return t instanceof Date&&!isNaN(t)}Date.prototype.getTimezoneOffsetMills=function(){return 60*this.getTimezoneOffset()*1e3},Date.prototype.getUTCTime=function(){return this.getTime()+this.getTimezoneOffsetMills()},Date.prototype.setUTCTime=function(t){t-=this.getTimezoneOffsetMills(),this.setTime(t)},Date.prototype.daysInMonth=function(){return new Date(this.getFullYear(),this.getMonth()+1,0).getDate()},Date.prototype.addDays=function(t){this.setDate(this.getDate()+t)},Date.prototype.print=function(){var t=this.getDate(),e=this.getMonth()+1;return(t=t<10?"0"+t:t)+"/"+(e=e<10?"0"+e:e)+"/"+this.getFullYear()},Date.prototype.parse=function(t){this.setDate(1);try{var e=(t=t.trim()).split("/");if(4!=e[2].length)throw{};if(isNaN(this.setFullYear(Number(e[2]))))throw{};if(isNaN(this.setMonth(Number(e[1])-1)))throw{};if(isNaN(this.setDate(Number(e[0]))))throw{};return this.setHours(0),this.setMinutes(0),this.setSeconds(0),this.setMilliseconds(0),!0}catch(t){return!1}},Date.prototype.parseDayEnd=function(t){this.setDate(1);try{var e=(t=t.trim()).split("/");if(4!=e[2].length)throw{};if(isNaN(this.setFullYear(Number(e[2]))))throw{};if(isNaN(this.setMonth(Number(e[1])-1)))throw{};if(isNaN(this.setDate(Number(e[0]))))throw{};return this.setHours(23),this.setMinutes(59),this.setSeconds(59),this.setMilliseconds(999),!0}catch(t){return!1}},Date.prototype.getWeek=function(){var t=new Date(this.getFullYear(),0,1);return Math.ceil(((this-t)/864e5+t.getDay()+1)/7)};var getFlattenedArray=function(t,e){function s(o,i,a){a=a||[];try{Object.keys(o).forEach(function(t){var e=i?i+"_"+t:t;if(o[t])if(Array.isArray(o[t]))for(var n=0,r=o[t].length;n<r;n++)0<n&&(u.push({}),c++),"object"!=typeof o[t][n]?(a.push(e),u[c][e]=o[t]):s(o[t][n],e,a);else"object"==typeof o[t]?s(o[t],e,a):(a.push(e),u[c][e]=o[t]);else a.push(e),u[c][e]=""})}catch(t){}}for(var l=[],u=[],c=0,n=[],r=0,o=t.length;r<o;r++){var i=t[r];u.push({}),s(i,"",l),l=_.uniq(l),1<u.length&&function(t){for(var e={},n=0,r=0,o=0,i=null,a=null,s=null,n=0,u=t.length;n<u;n++)for(i=t[n],r=0,o=l.length;r<o;r++)null!=(s=i[a=l[r]])?e[a]=s:e[a]&&(i[a]=e[a]);for(e={},n=t.length-1;0<=n;n--)for(i=t[n],r=0,o=l.length;r<o;r++)null!=(s=i[a=l[r]])?e[a]=s:e[a]&&(i[a]=e[a])}(u),n=n.concat(u),c=0,u=[]}return l.sort(),e||(n=_.uniqWith(n,_.isEqual)),{keys:l,values:n}},__round=function(t){return t?_.round(t,3):0};function datenum(t,e){e&&(t+=1462);e=-1*t.getTimezoneOffsetMills(),t=Date.parse(t);return((t+=e)-new Date(Date.UTC(1899,11,30)))/864e5}function sheet_from_array_of_arrays(t,e){for(var n={},r={s:{c:1e7,r:1e7},e:{c:0,r:0}},o=0;o!=t.length;++o)for(var i=0;i!=t[o].length;++i){r.s.r>o&&(r.s.r=o),r.s.c>i&&(r.s.c=i),r.e.r<o&&(r.e.r=o),r.e.c<i&&(r.e.c=i);var a,s={v:t[o][i]};null!=s.v&&(a=XLSX.utils.encode_cell({c:i,r:o}),"number"==typeof s.v?s.t="n":"boolean"==typeof s.v?s.t="b":s.v instanceof Date?(s.t="n",s.z=XLSX.SSF._table[14],s.v=datenum(s.v)):s.t="s",n[a]=s)}return r.s.c<1e7&&(n["!ref"]=XLSX.utils.encode_range(r)),n}function Workbook(){if(!(this instanceof Workbook))return new Workbook;this.SheetNames=[],this.Sheets={}}function s2ab(t){for(var e=new ArrayBuffer(t.length),n=new Uint8Array(e),r=0;r!=t.length;++r)n[r]=255&t.charCodeAt(r);return e}function date2String(t){var e=t.getDate();e<10&&(e="0"+e);var n=t.getMonth()+1;return e+"/"+(n=n<10?"0"+n:n)+"/"+t.getFullYear()}var offset=(new Date).getTimezoneOffsetMills();function excelDateToJSDate(t){return new Date(Math.round(86400*(t-25569)*1e3+offset))}