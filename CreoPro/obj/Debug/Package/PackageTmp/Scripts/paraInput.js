﻿$(document).ready(function () {

    //初始化页面时，加载列表（包含分页）
    getParaList(null, 1, true);

    //启动Creo按钮
    $('#startCreo').click(function () {
        $.ajax({
            type: "post",
            url: "/mainForm/startCreo",
            data: {},
            cache: false,
            dataType: "json",
            success: function (data) {
                console.log(data);
                $("#msg").text(data);
                $("#myModal").modal();
            }
        });
    });

    //快速选型
    $('#quickModel').click(function (event) {
        event.preventDefault(); //阻止元素发生默认的行为(阻止对表单的提交)
        fol_para();
        $('.td-para').attr("bgcolor", "#5BB75B");
    });

    //生成模型按钮
    $('#createModel').click(function () {
        var paras = JSON.stringify($('#paraForm').serializeObject());
        $.ajax({
            type: "post",
            url: "/mainForm/createModel",
            data: { paras: paras, regeflag: true },
            cache: false,
            dataType: "json",
            beforeSend: function () {
                $('#createModel').attr("disabled", "disabled");
                $("#loadingModal").modal('show');
            },
            success: function (data) {
                if (data == "success") {
                    $('#createModel').removeAttr("disabled");
                    $("#loadingModal").modal('hide');
                }
            }
        });
    });

    //重生模型
    $('#regeModel').click(function () {
        var paras = JSON.stringify($('#paraForm').serializeObject());
        $.ajax({
            type: "post",
            url: "/mainForm/createModel",
            data: { paras: paras, regeflag: false },
            cache: false,
            dataType: "json",
            beforeSend: function () {
                $('#createModel').attr("disabled", "disabled");
                $("#loadingModal").modal('show');
            },
            success: function (data) {
                if (data == "success") {
                    $('#createModel').removeAttr("disabled");
                    $("#loadingModal").modal('hide');
                }
            }
        });
    });

    //参数输入（折叠框效果）
    $('#para_aMin').click(function () {
        fol_para();
    });

    //参数输入（折叠框效果）
    function fol_para() {
        var divcss = $('#paraDiv').attr("style").toString();
        if (divcss.indexOf("block") >= 0) {
            $("#paraDiv").slideToggle(500);
            $('#para_iMin').removeClass("glyphicon-chevron-up");
            $('#para_iMin').addClass("glyphicon-chevron-down");
        } else {
            $("#paraDiv").show(500);
            $('#para_iMin').removeClass("glyphicon-chevron-down");
            $('#para_iMin').addClass("glyphicon-chevron-up");
        }
    }

    //参数输入（打开折叠框）
    function open_para() {
        var divcss = $('#paraDiv').attr("style").toString();
        if (divcss.indexOf("block") < 0) {
            $("#paraDiv").show(500);
            $('#para_iMin').removeClass("glyphicon-chevron-down");
            $('#para_iMin').addClass("glyphicon-chevron-up");
        }
    }

    //参数列表（折叠框效果）
    $('#paralist_aMin').click(function () {
        var divcss = $('#paralistDiv').attr("style").toString();
        if (divcss.indexOf("block") >= 0) {
            $("#paralistDiv").slideToggle(500);
            $('#paralist_iMin').removeClass("glyphicon-chevron-up");
            $('#paralist_iMin').addClass("glyphicon-chevron-down");
        } else {
            $("#paralistDiv").show(500);
            $('#paralist_iMin').removeClass("glyphicon-chevron-down");
            $('#paralist_iMin').addClass("glyphicon-chevron-up");
        }
    });

    //过滤table中数据（去掉）
    $(".dyn").each(function () {
        var text = $(this).text();
        $(this).text(parseFloat(text));
    });

    //分页工具
    function pagiation(totalPage, pageIndex) {
        $(".tcdPageCode").createPage({
            pageCount: totalPage,
            current: pageIndex,
            backFn: function (p) {
                var formData = JSON.stringify($('#paraSelectForm').serializeObject());
                getParaList(formData, p, false);
            }
        });
    }

    //分页工具(只负责页码，不查数据)
    function pagiation_sel(totalPage, pageIndex) {
        $(".tcdPageCode").createPage({
            pageCount: totalPage,
            current: pageIndex,
            backFn: function (p) {
            }
        });
    }

    //查询
    $('#selFilter').click(function () {
        var formData = JSON.stringify($('#paraSelectForm').serializeObject());
        getParaList(formData, 1, false);
    });

    //加载参数列表
    function getParaList(formData, pageIndex, flag) {
        console.log("测试下拉选择：" + formData);
        $.ajax({
            type: "post",
            url: "/mainForm/paraList",
            data: { "formData": formData, "pageIndex": pageIndex },
            cache: false,
            dataType: "json",
            success: function (data) {
                var jsonObj = $.parseJSON(data.list);
                createTable(jsonObj);
                if (flag == true) {
                    pagiation(data.totalPage, pageIndex);
                } else {
                    pagiation_sel(data.totalPage, pageIndex);
                }
            }
        });
    }

    //动态创建table的tbody
    function createTable(data) {
        $("#listthead").html("");
        $("#listbody").html("");
        var isStand = $('#isStandard').is(':checked'); //是否标准
        var thead = "";
        var tbody = "";

        if (isStand) {
            thead += "<tr><th>选型</th><th>模数</th><th>容屑槽数</th><th>外径</th><th>全长</th><th>内孔直径</th><th>前角</th><th>顶刃后角</th><th>侧刃后角</th><th>系列</th><th>类型</th></tr>";
        } else {
            thead += "<tr><th>选型</th><th>模数</th><th>容屑槽数</th><th>外径</th><th>全长</th><th>内孔直径</th><th>前角</th><th>顶刃后角</th><th>侧刃后角</th><th>操作</th></tr>";
        }
        var len = data.length;
        for (var i = 0; i < len; i++) {
            if (isStand) {
                tbody = tbody + "<tr class='ta-tr'>"
                + "<td class='td-hid'><input type='text' value='" + JSON.stringify(data[i]) + "'/></td>"
                + "<td class='td-para'><input type='radio' name='ra_Para' value='" + data[i].parm_id + "'/></td>"
                + "<td class='dyn'>" + data[i].moshu + "</td>"
                + "<td>" + data[i].rongxieNum + "</td>"
                + "<td class='dyn'>" + data[i].deg + "</td>"
                + "<td class='dyn'>" + data[i].L + "</td>"
                + "<td class='dyn'>" + data[i].kongjing + "</td>"
                + "<td class='dyn'>" + data[i].qianjiao + "</td>"
                + "<td class='dyn'>" + data[i].dingrenAngle + "</td>"
                + "<td class='dyn'>" + data[i].cerenAngle + "</td>"
                + "<td class='dyn'>" + data[i].serail + "</td>"
                + "<td class='dyn'>" + data[i].type + "</td>"
                + "</tr>";
            } else {
                tbody = tbody + "<tr class='ta-tr'>"
                + "<td class='td-hid'><input type='text' value='" + JSON.stringify(data[i]) + "'/></td>"
                + "<td class='td-para'><input type='radio' name='ra_Para' value='" + data[i].parm_id + "'/></td>"
                + "<td class='dyn'>" + data[i].moshu + "</td>"
                + "<td>" + data[i].rongxieNum + "</td>"
                + "<td class='dyn'>" + data[i].deg + "</td>"
                + "<td class='dyn'>" + data[i].L + "</td>"
                + "<td class='dyn'>" + data[i].kongjing + "</td>"
                + "<td class='dyn'>" + data[i].qianjiao + "</td>"
                + "<td class='dyn'>" + data[i].dingrenAngle + "</td>"
                + "<td class='dyn'>" + data[i].cerenAngle + "</td>"
                + "<td><a class='btn btn-danger btn-mid btn-del' href='#'><i class='glyphicon glyphicon-trash icon-white i-padd'></i>删除</a></td>"
                + "</tr>";
            }
        }
        if (len == 0) {
            tbody = tbody + "<tr style='text-align: center'>"
                + "<td colspan='6'><font color='#cd0a0a'>暂无记录</font></td>"
                + "</tr>";
        }
        //添加到div中  
        $("#listthead").html(thead);
        $("#listbody").html(tbody);
    }

    //快速选型
    $(document).on('click', '.td-para', function () {
        $('.td-para').removeAttr("bgcolor"); //去掉提醒色
        open_para();
        var paraId = $("#listbody input[name='ra_Para']:checked").val();
        var $tr = $("#listbody input[name='ra_Para']:checked").parent().parent(); //获取选中行
        var para = $tr.children('.td-hid').children(':text').val(); //获取隐藏域中json格式parameter对象
        console.log("json参数：" + para);
        bindPara(para);
    });

    //给参数输入框动态赋值
    function bindPara(para) {
        var jsonObj = $.parseJSON(para); //转成json对象
        clearPara();
        $('#moshu').val(jsonObj['moshu']); //模数
        $('#rongxieNum').val(jsonObj['rongxieNum']); //容屑槽数
        $('#waijing').val(jsonObj['deg']); //外径
        $('#quanchang').val(jsonObj['L']); //全长
        $('#qianjiao').val(jsonObj['qianjiao']); //前角
        $('#zhoutaiD').val(jsonObj['zhoutaiD']); //轴台直径
        $('#zhoutaiL').val(jsonObj['zhoutaiL']); //轴台长度
        $('#neikongD').val(jsonObj['kongjing']); //内孔直径
        $('#kongdaoD').val(jsonObj['kongdaoD']); //空刀直径
        $('#kongdaoL').val(jsonObj['kongdaoL']); //空刀长度
        $('#jiancaoW').val(jsonObj['jiancaoW']); //键槽宽度
        $('#jiancaoH').val(jsonObj['jiancaoH']); //键槽高度
        $('#daojiaoL').val(jsonObj['celeng']); //倒角边长
        $('#dingrenAngle').val(jsonObj['dingrenAngle']); //顶刃后角
        $('#cerenAngle').val(jsonObj['cerenAngle']); //侧刃后角
    }

    //清空输入框值
    function clearPara() {
        $('#moshu').val(); //模数
        $('#rongxieNum').val(); //容屑槽数
        $('#waijing').val(); //外径
        $('#quanchang').val(); //全长
        $('#qianjiao').val(); //前角
        $('#zhoutaiD').val(); //轴台直径
        $('#zhoutaiL').val(); //轴台长度
        $('#neikongD').val(); //内孔直径
        $('#kongdaoD').val(); //空刀直径
        $('#kongdaoL').val(); //空刀长度
        $('#jiancaoW').val(); //键槽宽度
        $('#jiancaoH').val(); //键槽高度
        $('#daojiaoL').val(); //倒角边长
        $('#dingrenAngle').val(); //顶刃后角
        $('#cerenAngle').val(); //侧刃后角
    }

    //删除参数，弹出确认删除对话框
    $(document).on('click', '.btn-del', function () {
        var $tr = $(this).parent().parent();
        var paraId = $tr.children('.td-para').children(':radio').val(); //参数ID
        $('#delHidValue').val(paraId);
        $('#delcfmModel').modal();
    });

    //确认删除参数
    $('#cfmDelPara').click(function () {
        var paraId = $('#delHidValue').val();
        $.ajax({
            type: "post",
            url: "/mainForm/delPara",
            data: { paraId: paraId },
            cache: false,
            dataType: "json",
            success: function (data) {
                var massage = data;
                if (massage == "True") {
                    $('#msg').text("删除成功！");
                    getParaList(null, 1, true); //刷新界面
                } else {
                    $('#msg').text("删除失败！");
                }
                $('#delcfmModel').modal('hide');
                $('#myModal').modal();
            }
        });
    });

    //是否标准 触发事件
    $(document).on('change', '#isStandard', function () {
        var isStand = $('#isStandard').is(':checked'); //是否标准
        if (isStand) {
            $('#standDiv').removeClass("div-hid");
        } else {
            $('#standDiv').addClass("div-hid");
        }
    });

});