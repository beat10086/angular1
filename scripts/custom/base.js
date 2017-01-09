var permission = {
    "code": 0,
    "message": "成功",
    "permissions": [
        ["admin.*", [
            ["admin.appconfig.*", ["admin.appconfig.config_list", "admin.appconfig.newest_config", "admin.appconfig.release_config", "admin.appconfig.update_config"]],
            ["admin.apppkg.*", ["admin.apppkg.add", "admin.apppkg.add_channel", "admin.apppkg.channel_info", "admin.apppkg.channel_list", "admin.apppkg.edit", "admin.apppkg.edit_channel", "admin.apppkg.info", "admin.apppkg.list", "admin.apppkg.remove", "admin.apppkg.remove_channel"]],
            ["admin.audit.*", ["admin.audit.action_delete", "admin.audit.action_info", "admin.audit.action_list", "admin.audit.content_delete", "admin.audit.content_info", "admin.audit.content_list"]],
            ["admin.auth.*", ["admin.auth.administrator_list", "admin.auth.get_user_permissions", "admin.auth.permission_list", "admin.auth.set_user_permissions"]],
            ["admin.coin.*", ["admin.coin.reward_topic"]],
            ["admin.datamining.*", ["admin.datamining.stat_all_list", "admin.datamining.stat_by_day_list", "admin.datamining.stat_by_hour_list", "admin.datamining.stat_by_month_list", "admin.datamining.stat_by_week_list"]],
            ["admin.exam.*", ["admin.exam.create", "admin.exam.delete", "admin.exam.edit", "admin.exam.info", "admin.exam.list"]],
            ["admin.face.*", ["admin.face.delete_star_face", "admin.face.detect", "admin.face.list", "admin.face.star_recognize_list"]],
            ["admin.feedback.*", ["admin.feedback.delete", "admin.feedback.edit", "admin.feedback.info", "admin.feedback.list", "admin.feedback.reply"]],
            ["admin.group.*", ["admin.group.create", "admin.group.delete", "admin.group.edit", "admin.group.info", "admin.group.list", "admin.group.set_status"]],
            ["admin.mall.*", ["admin.mall.category_create", "admin.mall.category_edit", "admin.mall.category_info", "admin.mall.category_list", "admin.mall.category_set_position", "admin.mall.good_create", "admin.mall.good_edit", "admin.mall.good_info", "admin.mall.good_list", "admin.mall.good_set_position", "admin.mall.navigation_create", "admin.mall.navigation_edit", "admin.mall.navigation_info", "admin.mall.navigation_list", "admin.mall.navigation_set_position"]],
            ["admin.message.*", ["admin.message.push", "admin.message.send_new_topic_message"]],
            ["admin.notify.*", ["admin.notify.cancel_sending", "admin.notify.delete", "admin.notify.edit", "admin.notify.info", "admin.notify.list", "admin.notify.publish", "admin.notify.send_notify", "admin.notify.sending_status"]],
            ["admin.oplog.*", ["admin.oplog.list", "admin.oplog.user_list", "admin.oplog.user_delete", "admin.oplog.user_recovery"]],
            ["admin.post.*", ["admin.post.create", "admin.post.delete", "admin.post.edit", "admin.post.info", "admin.post.list"]],
            ["admin.recommend.*", ["admin.recommend.add", "admin.recommend.delete", "admin.recommend.list", "admin.recommend.set_recommend_position"]],
            ["admin.report.*", ["admin.report.delete", "admin.report.edit", "admin.report.info", "admin.report.list"]],
            ["admin.spider.*", ["admin.spider.task_create", "admin.spider.task_eidt", "admin.spider.task_info", "admin.spider.task_list", "admin.spider.task_retry", "admin.spider.task_update"]],
            ["admin.star.*", ["admin.star.add", "admin.star.add_album_work", "admin.star.add_photo", "admin.star.add_work", "admin.star.album_info", "admin.star.album_list", "admin.star.album_works", "admin.star.create_album", "admin.star.crowdsourced_photo_list", "admin.star.delete", "admin.star.delete_album", "admin.star.delete_crowdsourced_photo", "admin.star.delete_photo", "admin.star.delete_work", "admin.star.detect_crowdsourced_photo", "admin.star.edit", "admin.star.edit_album", "admin.star.edit_photo", "admin.star.edit_work", "admin.star.info", "admin.star.list", "admin.star.photo_info", "admin.star.photo_list", "admin.star.remove_album_work", "admin.star.search", "admin.star.set_album_work_position", "admin.star.set_star_photo_position", "admin.star.set_star_work_position", "admin.star.work_info", "admin.star.work_list"]],
            ["admin.storage.*", ["admin.storage.delete_file", "admin.storage.edit_file", "admin.storage.file_info", "admin.storage.file_list"]],
            ["admin.topic.*", ["admin.topic.create", "admin.topic.delete", "admin.topic.edit", "admin.topic.info", "admin.topic.list", "admin.topic.move", "admin.topic.publish", "admin.topic.set_status"]],
            ["admin.user.*", ["admin.user.edit", "admin.user.info", "admin.user.list", "admin.user.login_as", "admin.user.mute", "admin.user.honor", "admin.user.history_msg", "admin.user.sendmsg"]]
        ]]
    ]
}
$.getLocalTime = function(time) {
    if (!time) return time;
    time = time.replace(/(\s|:)/g, function() {
        return '-';
    }).split('-');
    var date = new Date(new Date(time[0], (parseInt(time[1]) - 1), time[2], time[3], time[4], time[5]).getTime() + 8 * 60 * 60 * 1000);
    return date.format('yyyy-MM-dd hh:mm:ss');
};
$.getUTCTime = function(time) {
    if (!time) return time;
    time = time.replace(/(\s|:)/g, function() {
        return '-';
    }).split('-');
    var date = new Date(new Date(time[0], (parseInt(time[1]) - 1), time[2], time[3], time[4], time[5]).getTime() - 8 * 60 * 60 * 1000);
    return date.format('yyyy-MM-dd hh:mm:ss');
};
/**
 * [format description]
 * @param  {[type]} format [description]
 * @return {[type]}        [description]
 */
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    };
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        };
    };
    return format;
};
var swapItems = function(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
};
// $(function() {
//     $(document).on('click', '.sidenav-title', function() {
//         var index=$(this).parents('.nav-group').index();
//         navToggle(index)
//     })
// })
var formatDatamining=function(time,type){
    //type  hour day week month  all
     if (!time) return time;
    var f={
        'hour':'yyyy-MM-dd hh:mm',
        'day':'yyyy-MM-dd',
        'week':'yyyy-MM-dd',
        'month':'yyyy-MM',
        'all':'yyyy-MM-dd hh:mm'
    }[type];
    time = time.replace(/(\s|:)/g, function() {
        return '-';
    }).split('-');
    console.log(time);
    var date = new Date(new Date(time[0], (parseInt(time[1]) - 1), time[2]||1, time[3]||0, time[4]||0, time[5]||0).getTime());
    console.log(date);
    return date.format(f);
}
var dateDayToWeek=function(time){
    var yearModel=31556926;
    var weekModel=604800;
    var hourModel=3600;
    if (!time) return time;
    time = time.replace(/(\s|:)/g, function() {
        return '-';
    }).split('-');
    var date =new Date(time[0], (parseInt(time[1]) - 1), time[2]||0, time[3]||0, time[4]||0, time[5]||0);
    var yearValue=date.format('yyyy');
    date=(date.getTime()/1000 + 8 * hourModel);
    //去除年
    date=date%yearModel;
    //算周
    console.log(date/weekModel);
    date=Math.ceil(date/weekModel);
    return yearValue+'-'+date;
}
