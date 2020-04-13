var Persons_Vue = new Vue({
    el:"#PersonInformation",
    data:{
        Persons:{}, //村民们
        Groups:{},   //组名索引 [groupname] -> groupnum
        Groups2:{},  //组名保存 ['g'+groupnum] -> groupname
        input_message:{             //输入新户的缓存数据
            'name':'','sex':'','birthday':'','race':''
            ,'political':'','education':'','job':''
            ,'ownerid':'','phone':'','fc':'','familynum':''
            ,'photo':'','income':'','fielding':''
            ,'breeding':'','causeofpoverty':''
            ,'remark':'','groupnum':'','viligers':''
        },
        print_message:{             //展示户的缓存数据
            'name':'','sex':'','birthday':'','race':''
            ,'political':'','education':'','job':''
            ,'ownerid':'','phone':'','fc':'','familynum':''
            ,'photo':'','income':'','fielding':''
            ,'breeding':'','causeofpoverty':''
            ,'remark':'','groupnum':'','viligers':''
        },
        input_groupname:{
            'groupname':''
        },
        input_viliger:{
            'name':'',
            'ownerid':'',
            'sex':'',
            'relation':'',
            'job':'',
            'birthday':'',
            'id':''
        },
        find_people_keys:['身份证','姓名'],
        find_people_input:{
            key:'',
            value:''
        }
    },
    methods:{
        Botton_ADD_Group:function(){Botton_ADD_Group();},           //对接按钮功能：添加新组
        Botton_ADD_Household:function(){Botton_ADD_Household();},   //对接按钮功能：添加新户
        Botton_ADD_Viliger:function(){Botton_ADD_Viliger();},       //对接按钮功能：添加新人
        Botton_Change_Print:function(household){                    //按钮功能：改变展示户
            if(household.groupnum!=Persons_Vue.print_message.groupnum||household.ownerid!=Persons_Vue.print_message.ownerid){
                $('#housholdinfodisplay').fadeOut('fast',()=>{
                    Vue.set(Persons_Vue,'print_message',household);
                    for(obj in Persons_Vue.print_message){
                        if(Persons_Vue.print_message[obj]==='wq648a52vke1')
                            Vue.set(Persons_Vue.print_message,obj,'');
                    }
                });
                $('#housholdinfodisplay').fadeIn();
            }else{
                console.log('再次点击相同');
            }
        },
        Botton_Refrash_input_message:function(){                    //按钮功能：刷新输入缓存，响应按钮打开户添加框
            for(obj in Persons_Vue.input_message)
                Vue.set(Persons_Vue.input_message,obj,'');
            if(is_obj_empty(Persons_Vue.Persons)){
                Alert("错误","请先建立一个组","warning");
            }else{
                $('#newhouseholdmodal').modal({
                    backdrop: 'static',
                    keyboard: true
                });
            }
        },
        Botton_Refrash_input_groupname:function(){                  //按钮功能：刷新组名输入缓存，响应按钮打开组添加框
            for(obj in Persons_Vue.input_groupname)
                Vue.set(Persons_Vue.input_groupname,obj,'');
            $('#newgroupmodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_Refrash_input_viliger:function(){                    //按钮功能功能：刷新村民输入缓存，响应按钮打开村民添加框
            for(obj in Persons_Vue.input_viliger)
                Vue.set(Persons_Vue.input_viliger,obj,'');
            $('#newviligermodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_Isdelete:function(){                    //按钮功能功能：打开删除确认框
            $('#delhouseholdmodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_DEL_Group:function(groupnum){Botton_DEL_Group(groupnum);},   //对接按钮功能：删除组
        Botton_DEL_Viliger:function(id){Botton_DEL_Viliger(id);},            //对接按钮功能：删除村民
        Botton_DEL_Household:function(ownerid){ $('#delhouseholdmodal').modal('hide');$('#housholdinfodisplay').fadeOut(Botton_DEL_Household(ownerid));},//对接按钮功能：删除户
        Botton_Re_Household:function(){                                        //按钮功能：输出缓存->输入缓存，响应按钮打开户修改框
            for(obj in Persons_Vue.input_message)
                Vue.set(Persons_Vue.input_message,obj,Persons_Vue.print_message[obj]);
            Persons_Vue.input_message.groupnum = Persons_Vue.Groups2['g'+Persons_Vue.input_message.groupnum];
            console.log(this.input_message,this.print_message);
            $('#rehouseholdmodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_Cg_Household:function(){                                     //对接按钮功能：确认修改户
            $('#housholdinfodisplay').fadeOut(Botton_Cg_Household());
            $('#housholdinfodisplay').fadeIn();
        },
        Groupcolor:function(groupnum){                                      //辅助功能：根据组状态返回组颜色
            if(is_obj_empty(Persons_Vue.Persons[groupnum])){
                return 'opacity:0.5;';
            }
            else{
                return 'opacity:1.0;';
            }
        },
        Botton_Open_Find_People:()=>{
            for(obj in Persons_Vue.find_people_input)
                Vue.set(Persons_Vue.find_people_input,obj,'');
            $('#findpeoplemodal').modal({
                backdrop: 'static',
                keyboard: true
            });    
        },
        Botton_Begin_Find_People:()=>{
            if(Persons_Vue.find_people_input.key==''){
                Alert('错误','并未选择查找方式','warning','#bottonfindpeoalerts');
            }else if(Persons_Vue.find_people_input.value==''){
                Alert('错误','并未添加查找信息','warning','#bottonfindpeoalerts');
            }else{
                var key = '';
                if(Persons_Vue.find_people_input.key=='身份证'){key = 'ownerid';}
                else{key = 'name';}
                var value = Persons_Vue.find_people_input.value;
                
                console.log(key,value,Persons_Vue.find_people_input.value);

                var foudhousehold = undefined;
                for(groupnum in Persons_Vue.Persons){
                    for(ownerid in Persons_Vue.Persons[groupnum]){
                        var household = Persons_Vue.Persons[groupnum][ownerid];
                        //console.log(household.name);
                        if(household[key]==value){
                            foudhousehold = household;
                        }else{
                            for(id in household.viligers){
                                var key1 = key;
                                if(key1 == 'ownerid')   key1 = 'id';
                                if(household.viligers[id][key]==value){
                                    foudhousehold = household;
                                    break;
                                }
                            }
                        }
                        if(foudhousehold!=undefined)    break;
                    }
                    if(foudhousehold!=undefined)    break;
                }

               
                if(foudhousehold!=undefined){
                    Persons_Vue.Botton_Change_Print(foudhousehold);
                    $("#findpeoplemodal").modal('hide');
                    Alert('成功','查询到目标村民 '+value+' ，并跳转页面成功','success');
                }else{
                    $("#findpeoplemodal").modal('hide');
                    Alert('失败','没有查询到目标村民 '+value,'info');
                }
                
                //$("#findpeoplemodal").modal('hide');
            }
        },
        Botton_Re_Photo:()=>{
            Persons_Vue.input_message.photo = Persons_Vue.print_message.photo;
            $('#rehouseholdphotomodal').modal({
                backdrop: 'static',
                keyboard: true
            });    
        },
        Botton_Cg_Photo:()=>{
            $('#rehouseholdphotomodal').modal('hide');
            Persons_Vue.print_message.photo = Persons_Vue.input_message.photo;
            //console.log(Persons_Vue.print_message.ownerid);
            window.Cg_Household_Photo(Persons_Vue.print_message.ownerid,Persons_Vue.print_message.photo);
        }
    }
});






var Party_Vue = new Vue({
    el:'#PartyInformation',
    data:{
        Partys:{},
        input_message:{
            'uid':'',  //识别码
            'name':'', //项目名称
            'ownername':'',  //负责人姓名
            'ownerphone':'',  //负责人电话
            'unit':'',        //申请单位
            'unitphone':'',   //单位电话
            'begindate':'',   //开始日期
            'message':'',     //项目进度和信息
            'remark':''       //备注
        },
        order:'uid',
        translation:{
            '默认':'uid',  //识别码
            '项目名称':'name', 
            '负责人姓名':'ownername',  //负责人姓名
            '负责人电话':'ownerphone',  //负责人电话
            '申请单位':'unit',        //申请单位
            '单位电话':'unitphone',   //单位电话
            '登记日期':'begindate',   //登记日期
        }
    },
    methods:{
        
        Re_Order:()=>{
            console.log('单击',Party_Vue.order)
            Party_Vue.Partys = {};
            ReadPartys(Party_Vue.order);
        },


        Botton_ADD_Party:()=>{
            if( Party_Vue.input_message.name==""||
                Party_Vue.input_message.begindate==""||
                Party_Vue.input_message.ownername==""||
                Party_Vue.input_message.ownerphone==""
            ){
                Alert("错误","项目名称、申请日期、负责人姓名、负责人电话为必填项","warning","#bottonaddptalert");
            }else{
                $("#newpartymodal").modal('hide');
                console.log(Party_Vue.input_message);
                maxuid++;
                let input_message = Party_Vue.input_message;
                let newparty={};
                for(obj in input_message)   newparty[obj] = input_message[obj];
                newparty.uid = maxuid;
                console.log(newparty);
                Vue.set(Party_Vue.Partys,newparty.uid,newparty);
                window.ADD_Party_sql(newparty);
                Alert("成功","创建项目\""+newparty.name+"\"成功","success"); 
                /*
                for(obj in Persons_Vue.input_message)
                    Vue.set(Persons_Vue.input_message,obj,'');
                */
            }
        },
        Botton_Refrash_input_message:()=>{
            for(obj in Party_Vue.input_message)
                Vue.set(Party_Vue.input_message,obj,'');
            $('#newpartymodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_DEL_Party:(uid)=>{
            var name = Party_Vue.Partys[uid].name;
            Vue.delete(Party_Vue.Partys,uid);
            window.DEL_Party(uid);
            Alert("成功","删除项目\""+name+"\"成功","success");
        },
        Botton_Re_Party:(uid)=>{                                        //按钮功能：输出缓存->输入缓存，响应按钮打开户修改框
            for(obj in Party_Vue.input_message)
                Vue.set(Party_Vue.input_message,obj,Party_Vue.Partys[uid][obj]);
            $('#repartymodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_Cg_Party:()=>{
            if( Party_Vue.input_message.name==""||
                Party_Vue.input_message.begindate==""||
                Party_Vue.input_message.ownername==""||
                Party_Vue.input_message.ownerphone==""
            ){  
                Alert("错误","项目名称、申请日期、负责人姓名、负责人电话为必填项","warning","#bottoncgptalert");
            }else{
                $("#repartymodal").modal('hide');
                var uid = Party_Vue.input_message.uid;
                window.DEL_Party(uid);
                console.log(Party_Vue.input_message,uid,Party_Vue.Partys[uid]);
                for(obj in Party_Vue.input_message)
                    Vue.set(Party_Vue.Partys[uid],obj,Party_Vue.input_message[obj]);
                window.ADD_Party_sql(Party_Vue.Partys[uid]);
                Alert("成功","修改项目成功","success");
                /*
                for(obj in Persons_Vue.input_message)
                    Vue.set(Persons_Vue.input_message,obj,'');
                */
            }
        },
        Botton_Dis_Party_message:(uid)=>{
            Party_Vue.input_message.uid = uid;
            Party_Vue.input_message.message = Party_Vue.Partys[uid].message;
            $('#displaypartymessagemodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_Cg_Party_message:(uid)=>{
            $("#displaypartymessagemodal").modal('hide');
            if(Party_Vue.Partys[uid].message != Party_Vue.input_message.message){
                Party_Vue.Partys[uid].message = Party_Vue.input_message.message
                window.Update_Party_message(uid,Party_Vue.Partys[uid].message);
                Alert("成功","更新项目信息","success");
            }else{

            }
        }
    }
});







var Construction_Vue = new Vue({
    el:'#ConstructionInformation',
    data:{
        Constructions:{},
        input_message:{
            'uid':'',  //识别码
            'name':'', //项目名称
            'ownername':'',  //负责人姓名
            'ownerphone':'',  //负责人电话
            'unit':'',        //申请单位
            'unitphone':'',   //单位电话
            'begindate':'',   //开始日期
            'message':'',     //项目进度和信息
            'remark':''       //备注
        },
        order:'uid',
        translation:{
            '默认':'uid',  //识别码
            '项目名称':'name', 
            '负责人姓名':'ownername',  //负责人姓名
            '负责人电话':'ownerphone',  //负责人电话
            '申请单位':'unit',        //申请单位
            '单位电话':'unitphone',   //单位电话
            '登记日期':'begindate',   //登记日期
        }
    },
    methods:{
        
        Re_Order:()=>{
            console.log('单击',Construction_Vue.order)
            Construction_Vue.Constructions = {};
            ReadConstructions(Construction_Vue.order);
        },


        Botton_ADD_Construction:()=>{
            if( Construction_Vue.input_message.name==""||
                Construction_Vue.input_message.begindate==""||
                Construction_Vue.input_message.ownername==""||
                Construction_Vue.input_message.ownerphone==""
            ){
                Alert("错误","项目名称、申请日期、负责人姓名、负责人电话为必填项","warning","#bottonaddctalert");
            }else{
                $("#newconstructionmodal").modal('hide');
                console.log(Construction_Vue.input_message);
                maxuid++;
                let input_message = Construction_Vue.input_message;
                let newconstruction={};
                for(obj in input_message)   newconstruction[obj] = input_message[obj];
                newconstruction.uid = maxuid;
                console.log(newconstruction);
                Vue.set(Construction_Vue.Constructions,newconstruction.uid,newconstruction);
                window.ADD_Construction_sql(newconstruction);
                Alert("成功","创建项目\""+newconstruction.name+"\"成功","success"); 
                /*
                for(obj in Persons_Vue.input_message)
                    Vue.set(Persons_Vue.input_message,obj,'');
                */
            }
        },
        Botton_Refrash_input_message:()=>{
            for(obj in Construction_Vue.input_message)
                Vue.set(Construction_Vue.input_message,obj,'');
            $('#newconstructionmodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_DEL_Construction:(uid)=>{
            var name = Construction_Vue.Constructions[uid].name;
            Vue.delete(Construction_Vue.Constructions,uid);
            window.DEL_Construction(uid);
            Alert("成功","删除项目\""+name+"\"成功","success");
        },
        Botton_Re_Construction:(uid)=>{                                        //按钮功能：输出缓存->输入缓存，响应按钮打开户修改框
            for(obj in Construction_Vue.input_message)
                Vue.set(Construction_Vue.input_message,obj,Construction_Vue.Constructions[uid][obj]);
            $('#reconstructionmodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_Cg_Construction:()=>{
            if( Construction_Vue.input_message.name==""||
                Construction_Vue.input_message.begindate==""||
                Construction_Vue.input_message.ownername==""||
                Construction_Vue.input_message.ownerphone==""
            ){  
                Alert("错误","项目名称、申请日期、负责人姓名、负责人电话为必填项","warning","#bottoncgctalert");
            }else{
                $("#reconstructionmodal").modal('hide');
                var uid = Construction_Vue.input_message.uid;
                window.DEL_Construction(uid);
                console.log(Construction_Vue.input_message,uid,Construction_Vue.Constructions[uid]);
                for(obj in Construction_Vue.input_message)
                    Vue.set(Construction_Vue.Constructions[uid],obj,Construction_Vue.input_message[obj]);
                window.ADD_Construction_sql(Construction_Vue.Constructions[uid]);
                Alert("成功","修改项目成功","success");
                /*
                for(obj in Persons_Vue.input_message)
                    Vue.set(Persons_Vue.input_message,obj,'');
                */
            }
        },
        Botton_Dis_Construction_message:(uid)=>{
            Construction_Vue.input_message.uid = uid;
            Construction_Vue.input_message.message = Construction_Vue.Constructions[uid].message;
            $('#displayconstructionmessagemodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_Cg_Construction_message:(uid)=>{
            $("#displayconstructionmessagemodal").modal('hide');
            if(Construction_Vue.Constructions[uid].message != Construction_Vue.input_message.message){
                Construction_Vue.Constructions[uid].message = Construction_Vue.input_message.message
                window.Update_Construction_message(uid,Construction_Vue.Constructions[uid].message);
                Alert("成功","更新项目信息","success");
            }else{

            }
        }
    }
});






var Equipment_Vue = new Vue({
    el:'#EquipmentsInformation',
    data:{
        Equipments:{},
        input_message:{
            'uid':'',  //识别码
            'name':'', //项目名称
            'ownername':'',  //负责人姓名
            'ownerphone':'',  //负责人电话
            'begindate':'',   //登记日期
            'message':'',     //信息
            'remark':''       //备注
        },
        order:'uid',
        translation:{
            '默认':'uid',  //识别码
            '项目名称':'name', 
            '负责人姓名':'ownername',  //负责人姓名
            '负责人电话':'ownerphone',  //负责人电话
            '登记日期':'begindate',   //登记日期
        }
    },
    methods:{
        
        Re_Order:()=>{
            Equipment_Vue.Equipments = {};
            ReadEquipments(Equipment_Vue.order);
        },
        Botton_ADD_Equipment:()=>{
            if( Equipment_Vue.input_message.name==""||
                Equipment_Vue.input_message.begindate==""||
                Equipment_Vue.input_message.ownername==""||
                Equipment_Vue.input_message.ownerphone==""
            ){
                Alert("错误","设备名称、登记日期、负责人姓名、负责人电话为必填项","warning","#bottonaddeqalert");
            }else{
                $("#newequipmentmodal").modal('hide');
                console.log(Equipment_Vue.input_message);
                maxuid++;
                let input_message = Equipment_Vue.input_message;
                let newequipment={};
                for(obj in input_message)   newequipment[obj] = input_message[obj];
                newequipment.uid = maxuid;
                console.log(newequipment);
                Vue.set(Equipment_Vue.Equipments,newequipment.uid,newequipment);
                window.ADD_Equipment_sql(newequipment);
                Alert("成功","创建项目\""+newequipment.name+"\"成功","success"); 
                /*
                for(obj in Persons_Vue.input_message)
                    Vue.set(Persons_Vue.input_message,obj,'');
                */
            }
        },
        Botton_Refrash_input_message:()=>{
            for(obj in Equipment_Vue.input_message)
                Vue.set(Equipment_Vue.input_message,obj,'');
            $('#newequipmentmodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_DEL_Equipment:(uid)=>{
            var name = Equipment_Vue.Equipments[uid].name;
            Vue.delete(Equipment_Vue.Equipments,uid);
            window.DEL_Equipment(uid);
            Alert("成功","删除项目\""+name+"\"成功","success");
        },
        Botton_Re_Equipment:(uid)=>{                                        //按钮功能：输出缓存->输入缓存，响应按钮打开户修改框
            for(obj in Equipment_Vue.input_message)
                Vue.set(Equipment_Vue.input_message,obj,Equipment_Vue.Equipments[uid][obj]);
            $('#reequipmentmodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_Cg_Equipment:()=>{
            if( Equipment_Vue.input_message.name==""||
                Equipment_Vue.input_message.begindate==""||
                Equipment_Vue.input_message.ownername==""||
                Equipment_Vue.input_message.ownerphone==""
            ){  
                Alert("错误","设备名称、登记日期、负责人姓名、负责人电话为必填项","warning","#bottoncgeqalert");
            }else{
                $("#reequipmentmodal").modal('hide');
                var uid = Equipment_Vue.input_message.uid;
                window.DEL_Equipment(uid);
                console.log(Equipment_Vue.input_message,uid,Equipment_Vue.Equipments[uid]);
                for(obj in Equipment_Vue.input_message)
                    Vue.set(Equipment_Vue.Equipments[uid],obj,Equipment_Vue.input_message[obj]);dfvreeewrewrr
                window.ADD_Equipment_sql(Equipment_Vue.Equipments[uid]);
                Alert("成功","修改设备信息成功","success");
                /*
                for(obj in Persons_Vue.input_message)
                    Vue.set(Persons_Vue.input_message,obj,'');
                */
            }
        },
        Botton_Dis_Equipment_message:(uid)=>{
            Equipment_Vue.input_message.uid = uid;
            Equipment_Vue.input_message.message = Equipment_Vue.Equipments[uid].message;
            $('#displayequipmentmessagemodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_Cg_Equipment_message:(uid)=>{
            $("#displayequipmentmessagemodal").modal('hide');
            if(Equipment_Vue.Equipments[uid].message != Equipment_Vue.input_message.message){
                Equipment_Vue.Equipments[uid].message = Equipment_Vue.input_message.message
                window.Update_Equipment_message(uid,Equipment_Vue.Equipments[uid].message);
                Alert("成功","更新设备信息","success");
            }else{

            }
        }
    }
});








var Alleviation_Vue = new Vue({
    el:'#AlleviationsInformation',
    data:{
        Alleviations:{},
        input_message:{
            'uid':'',  //识别码
            'name':'', //扶贫记录标称
            'ownername':'',  //负责人姓名
            'ownerphone':'',  //负责人电话
            'begindate':'',   //登记日期
            'message':'',     //信息
            'remark':''       //备注
        },
        order:'uid',
        translation:{
            '默认':'uid',  //识别码
            '项目名称':'name', 
            '负责人姓名':'ownername',  //负责人姓名
            '负责人电话':'ownerphone',  //负责人电话
            '登记日期':'begindate',   //登记日期
        }
    },
    methods:{
        
        Re_Order:()=>{
            Alleviation_Vue.Alleviations = {};
            ReadAlleviations(Alleviation_Vue.order);
        },
        Botton_ADD_Alleviation:()=>{
            if( Alleviation_Vue.input_message.name==""||
                Alleviation_Vue.input_message.begindate==""||
                Alleviation_Vue.input_message.ownername==""||
                Alleviation_Vue.input_message.ownerphone==""
            ){
                Alert("错误","扶贫记录标称、登记日期、负责人姓名、负责人电话为必填项","warning","#bottonaddalalert");
            }else{
                $("#newalleviationmodal").modal('hide');
                console.log(Alleviation_Vue.input_message);
                maxuid++;
                let input_message = Alleviation_Vue.input_message;
                let newalleviation={};
                for(obj in input_message)   newalleviation[obj] = input_message[obj];
                newalleviation.uid = maxuid;
                console.log(newalleviation);
                Vue.set(Alleviation_Vue.Alleviations,newalleviation.uid,newalleviation);
                window.ADD_Alleviation_sql(newalleviation);
                Alert("成功","创建扶贫记录\""+newalleviation.name+"\"成功","success"); 
                /*
                for(obj in Persons_Vue.input_message)
                    Vue.set(Persons_Vue.input_message,obj,'');
                */
            }
        },
        Botton_Refrash_input_message:()=>{
            for(obj in Alleviation_Vue.input_message)
                Vue.set(Alleviation_Vue.input_message,obj,'');
            $('#newalleviationmodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_DEL_Alleviation:(uid)=>{
            var name = Alleviation_Vue.Alleviations[uid].name;
            Vue.delete(Alleviation_Vue.Alleviations,uid);
            window.DEL_Alleviation(uid);
            Alert("成功","删除扶贫记录\""+name+"\"成功","success");
        },
        Botton_Re_Alleviation:(uid)=>{                                        //按钮功能：输出缓存->输入缓存，响应按钮打开户修改框
            for(obj in Alleviation_Vue.input_message)
                Vue.set(Alleviation_Vue.input_message,obj,Alleviation_Vue.Alleviations[uid][obj]);
            $('#realleviationmodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_Cg_Alleviation:()=>{
            if( Alleviation_Vue.input_message.name==""||
                Alleviation_Vue.input_message.begindate==""||
                Alleviation_Vue.input_message.ownername==""||
                Alleviation_Vue.input_message.ownerphone==""
            ){  
                Alert("错误","扶贫记录标称、登记日期、负责人姓名、负责人电话为必填项","warning","#bottoncgalalert");
            }else{
                $("#realleviationmodal").modal('hide');
                var uid = Alleviation_Vue.input_message.uid;
                window.DEL_Alleviation(uid);
                console.log(Alleviation_Vue.input_message,uid,Alleviation_Vue.Alleviations[uid]);
                for(obj in Alleviation_Vue.input_message)
                    Vue.set(Alleviation_Vue.Alleviations[uid],obj,Alleviation_Vue.input_message[obj]);
                window.ADD_Alleviation_sql(Alleviation_Vue.Alleviations[uid]);
                Alert("成功","修改补助成功","success");
                /*
                for(obj in Persons_Vue.input_message)
                    Vue.set(Persons_Vue.input_message,obj,'');
                */
            }
        },
        Botton_Dis_Alleviation_message:(uid)=>{
            Alleviation_Vue.input_message.uid = uid;
            Alleviation_Vue.input_message.message = Alleviation_Vue.Alleviations[uid].message;
            $('#displayalleviationmessagemodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_Cg_Alleviation_message:(uid)=>{
            $("#displayalleviationmessagemodal").modal('hide');
            if(Alleviation_Vue.Alleviations[uid].message != Alleviation_Vue.input_message.message){
                Alleviation_Vue.Alleviations[uid].message = Alleviation_Vue.input_message.message
                window.Update_Alleviation_message(uid,Alleviation_Vue.Alleviations[uid].message);
                Alert("成功","更新补助信息","success");
            }else{

            }
        }
    }
});










var Dog_Vue = new Vue({
    el:'#DogsInformation',
    data:{
        Dogs:{},
        input_message:{
            'uid':'',  //识别码
            'name':'', //雪橇犬名称
            'ownername':'',  //负责人姓名
            'ownerphone':'',  //负责人电话
            'begindate':'',   //登记日期
            'message':'',     //信息
            'remark':''       //备注
        },
        order:'uid',
        translation:{
            '默认':'uid',  //识别码
            '项目名称':'name', 
            '负责人姓名':'ownername',  //负责人姓名
            '负责人电话':'ownerphone',  //负责人电话
            '登记日期':'begindate',   //登记日期
        }
    },
    methods:{
        
        Re_Order:()=>{
            Dog_Vue.Dogs = {};
            ReadDogs(Dog_Vue.order);
        },
        Botton_ADD_Dog:()=>{
            if( Dog_Vue.input_message.name==""||
                Dog_Vue.input_message.begindate==""||
                Dog_Vue.input_message.ownername==""||
                Dog_Vue.input_message.ownerphone==""
            ){
                Alert("错误","雪橇犬名称、登记日期、负责人姓名、负责人电话为必填项","warning","#bottonadddgalert");
            }else{
                $("#newdogmodal").modal('hide');
                console.log(Dog_Vue.input_message);
                maxuid++;
                let input_message = Dog_Vue.input_message;
                let newdog={};
                for(obj in input_message)   newdog[obj] = input_message[obj];
                newdog.uid = maxuid;
                console.log(newdog);
                Vue.set(Dog_Vue.Dogs,newdog.uid,newdog);
                window.ADD_Dog_sql(newdog);
                Alert("成功","创建雪橇犬信息\""+newdog.name+"\"成功","success"); 
                /*
                for(obj in Persons_Vue.input_message)
                    Vue.set(Persons_Vue.input_message,obj,'');
                */
            }
        },
        Botton_Refrash_input_message:()=>{
            for(obj in Dog_Vue.input_message)
                Vue.set(Dog_Vue.input_message,obj,'');
            $('#newdogmodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_DEL_Dog:(uid)=>{
            var name = Dog_Vue.Dogs[uid].name;
            Vue.delete(Dog_Vue.Dogs,uid);
            window.DEL_Dog(uid);
            Alert("成功","删除雪橇犬信息\""+name+"\"成功","success");
        },
        Botton_Re_Dog:(uid)=>{                                        //按钮功能：输出缓存->输入缓存，响应按钮打开户修改框
            for(obj in Dog_Vue.input_message)
                Vue.set(Dog_Vue.input_message,obj,Dog_Vue.Dogs[uid][obj]);
            $('#redogmodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_Cg_Dog:()=>{
            if( Dog_Vue.input_message.name==""||
                Dog_Vue.input_message.begindate==""||
                Dog_Vue.input_message.ownername==""||
                Dog_Vue.input_message.ownerphone==""
            ){  
                Alert("错误","雪橇犬名称、登记日期、负责人姓名、负责人电话为必填项","warning","#bottoncgdgalert");
            }else{
                $("#redogmodal").modal('hide');
                var uid = Dog_Vue.input_message.uid;
                window.DEL_Dog(uid);
                console.log(Dog_Vue.input_message,uid,Dog_Vue.Dogs[uid]);
                for(obj in Dog_Vue.input_message)
                    Vue.set(Dog_Vue.Dogs[uid],obj,Dog_Vue.input_message[obj]);
                window.ADD_Dog_sql(Dog_Vue.Dogs[uid]);
                Alert("成功","修改雪橇犬信息成功","success");
                /*
                for(obj in Persons_Vue.input_message)
                    Vue.set(Persons_Vue.input_message,obj,'');
                */
            }
        },
        Botton_Dis_Dog_message:(uid)=>{
            Dog_Vue.input_message.uid = uid;
            Dog_Vue.input_message.message = Dog_Vue.Dogs[uid].message;
            $('#displaydogmessagemodal').modal({
                backdrop: 'static',
                keyboard: true
            });
        },
        Botton_Cg_Dog_message:(uid)=>{
            $("#displaydogmessagemodal").modal('hide');
            if(Dog_Vue.Dogs[uid].message != Dog_Vue.input_message.message){
                Dog_Vue.Dogs[uid].message = Dog_Vue.input_message.message
                window.Update_Dog_message(uid,Dog_Vue.Dogs[uid].message);
                Alert("成功","更新雪橇犬信息","success");
            }else{

            }
        }
    }
});