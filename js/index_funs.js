/*
    预加载功能：从数据库读出数据至缓存
*/
var ReadPersons = ()=>{
    maxgroupnum = 0;
    window.GETALL_Group((group_rows)=>{
        console.log(group_rows);
        //Vue.set(Persons_Vue,'Groups',group_rows);
        for(index in group_rows){
            var groupnum = group_rows[index].groupnum;
            var groupname = group_rows[index].groupname;
            Vue.set(Persons_Vue.Groups,groupname,groupnum);
            Vue.set(Persons_Vue.Groups2,'g'+groupnum,groupname); 
            console.log('组：',groupnum,groupname);
            Vue.set(Persons_Vue.Persons,groupnum,{});
            if(groupnum>maxgroupnum)    maxgroupnum = groupnum;
            
            window.GET_Household_hasgroupnum(group_rows[index],(household_row)=>{
                var ownerid = household_row.ownerid;
                console.log('户：',household_row);
                Vue.set(Persons_Vue.Persons[household_row.groupnum],ownerid,household_row);
                Vue.set(Persons_Vue.Persons[household_row.groupnum][ownerid],'viligers',{});
                window.GET_Viliger_hasownerid(household_row,(viliger_row)=>{
                    for(obj in viliger_row)
                        if(viliger_row[obj]=='wq648a52vke1')
                            viliger_row[obj]='';
                    console.log('组号',household_row.groupnum,'户主身份证',household_row.ownerid);
                    Vue.set(Persons_Vue.Persons[household_row.groupnum][household_row.ownerid].viligers,viliger_row.id,viliger_row);
                });
            });
        }
    });
}
//preload
ReadPersons();

/*
    辅助功能：判断对象是否为空
*/
var is_obj_empty = (obj)=>{
    for(key in obj){
        return false;
    }
    return true;
}

/*
    按钮功能：添加组
    在缓存数据和数据库中添加一个新组
*/
var Botton_ADD_Group = ()=>{
    try{
        if(Persons_Vue.input_groupname.groupname==''){
            Alert("错误","组号不能为空！","warning","#bottonaddgpalerts");
        }else{
            $("#newgroupmodal").modal('hide');
            maxgroupnum++;
            var groupname = Persons_Vue.input_groupname.groupname;
            var groupnum = maxgroupnum+'';
            console.log(groupname);
            //Persons[maxgroupnum] = {};
            Vue.set(Persons_Vue.Persons,groupnum,{});
            Vue.set(Persons_Vue.Groups,groupname,groupnum);
            Vue.set(Persons_Vue.Groups2,'g'+groupnum,groupname);
            newGroup = {groupnum:groupnum,groupname:groupname};
            window.ADD_Group_sql(newGroup); 
            Alert("成功","创建组\""+groupname+"\"成功","success"); 
            //alert('新建成功');
        }
    }catch(err){
        console.log(err);
    }
}

/*
    按钮功能：添加户
    将输入缓存推入缓存数据和数据库
    undefined，boolean，number，string，null 等基本数据类型 = 赋值
    对象、数组、函数 = 引用 （相当于地址赋值）
*/
var Botton_ADD_Household = ()=>{
    try{
        if( Persons_Vue.input_message.groupnum==""||
            Persons_Vue.input_message.name==""||
            Persons_Vue.input_message.ownerid==""
        ){
            Alert("错误","户主姓名、身份证、组号为必填项","warning","#bottonaddhdalerts");
        }else{
            $("#newhouseholdmodal").modal('hide');
            console.log(Persons_Vue.input_message);
            let input_message = Persons_Vue.input_message;
            let newhousehold={};
            for(obj in input_message)   newhousehold[obj] = input_message[obj];
            newhousehold.groupnum = Persons_Vue.Groups[newhousehold.groupnum];
            console.log(newhousehold);
            Vue.set(Persons_Vue.Persons[newhousehold.groupnum],newhousehold.ownerid,newhousehold);
            window.ADD_Household_sql(newhousehold);
            Vue.set(Persons_Vue.Persons[newhousehold.groupnum][newhousehold.ownerid],'viligers',{});
            Alert("成功","创建户\""+newhousehold.name+"\"成功","success"); 
            /*
            for(obj in Persons_Vue.input_message)
                Vue.set(Persons_Vue.input_message,obj,'');
            */
        }
    }catch(err){
        console.log(err);
    }
}

/*
    按钮功能：添加人
*/
var Botton_ADD_Viliger = ()=>{
    try{
        if( Persons_Vue.input_viliger.name==""||
            Persons_Vue.input_viliger.id==""||
            Persons_Vue.input_viliger.relation==""
        ){
            Alert("错误","村民姓名、身份证、与户主关系为必填项","warning","#bottonaddvgalerts");
        }else{
            $("#newviligermodal").modal('hide');
            console.log(Persons_Vue.input_viliger);
            let input_viliger = Persons_Vue.input_viliger;
            let newviliger={};
            for(obj in input_viliger)   newviliger[obj] = input_viliger[obj];
            var ownerid = Persons_Vue.print_message.ownerid;
            var groupnum = Persons_Vue.print_message.groupnum;
            newviliger.ownerid = ownerid;
            console.log(groupnum,ownerid,newviliger);
            Vue.set(Persons_Vue.Persons[groupnum][ownerid].viligers,newviliger.id,newviliger);
            window.ADD_Viliger_sql(newviliger);
            Alert("成功","添加村民\""+newviliger.name+"\"成功","success"); 
        }
    }catch(err){
        console.log(err);
    }
}

/*
    按钮功能：删除组
    删除指定组，如果非空则反馈无法删除
*/
var Botton_DEL_Group = (groupnum)=>{
    try{
        let hasobj = 0;
        for(obj in Persons_Vue.Persons[groupnum]){
            hasobj++;
            console.log(obj,Persons_Vue.Persons[groupnum][obj]);
        }
        if(hasobj!=0){
            Alert("错误","该组非空，无法删除","warning");
            console.log('没有删除group',index,'hasobj:',hasobj);
        }else{
            var groupname = Persons_Vue.Groups2['g'+groupnum];
            Vue.delete(Persons_Vue.Persons,groupnum);
            Vue.delete(Persons_Vue.Groups,groupname);
            Vue.delete(Persons_Vue.Groups2,'g'+groupnum);
            window.DEL_Group(groupnum);
            //Persons_Vue.Groups.splice(index,1);
            Alert("成功","删除组\""+groupname+"\"成功","success");
        }
    }catch(err){
        console.log(err);
    }
}   

/*
    按钮功能：删除村民
    删除目标id的村民
*/
var Botton_DEL_Viliger = (id)=>{
    try{
        var name = Persons_Vue.print_message.viligers[id].name;
        var groupnum = Persons_Vue.print_message.groupnum;
        var ownerid = Persons_Vue.print_message.ownerid;
        Vue.delete(Persons_Vue.Persons[groupnum][ownerid].viligers,id);
        window.DEL_Viliger(id);
        Alert("成功","删除村民\""+name+"\"成功","success");
    }catch(err){
        console.log(err);
    }
}

/*
    按钮功能：删除户
    删除目标ownerid的户
*/
var Botton_DEL_Household = (ownerid)=>{
    try{
        var name = Persons_Vue.print_message.name;
        var groupnum = Persons_Vue.print_message.groupnum;
        Vue.delete(Persons_Vue.Persons[groupnum],ownerid);
        window.DEL_Viliger_hasownerid(ownerid);
        window.DEL_Household(ownerid);
        Alert("成功","删除户\""+name+"\"成功","success");
    }catch(err){
        console.log(err);
    }
}

/* 
    按钮功能：修改户信息
*/
var Botton_Cg_Household = ()=>{
    try{
        if( Persons_Vue.input_message.groupnum==""||
            Persons_Vue.input_message.name==""||
            Persons_Vue.input_message.ownerid==""
        ){  
            Alert("错误","户主姓名、身份证、组号为必填项","warning","#bottonrehdalerts");
        }else{
            $("#rehouseholdmodal").modal('hide');
            console.log('input_message',Persons_Vue.input_message);
            let ownerid = Persons_Vue.print_message.ownerid;
            //console.log(ownerid);
            Botton_DEL_Household(ownerid);
            let input_message = Persons_Vue.input_message;
            let newhousehold={};
            for(obj in input_message)   newhousehold[obj] = input_message[obj];
            newhousehold.groupnum = Persons_Vue.Groups[newhousehold.groupnum];
            console.log('newhousehold',newhousehold);
            Vue.set(Persons_Vue.Persons[newhousehold.groupnum],newhousehold.ownerid,newhousehold);
            window.ADD_Household_sql(newhousehold);
            window.Update_Viliger_ownerid(ownerid,newhousehold.ownerid);
            Vue.set(Persons_Vue,'print_message',newhousehold);
            for(obj in Persons_Vue.print_message){
                if(Persons_Vue.print_message[obj]==='wq648a52vke1')
                    Vue.set(Persons_Vue.print_message,obj,'');
            }
            Alert("成功","修改户信息成功","success");
            /*
            for(obj in Persons_Vue.input_message)
                Vue.set(Persons_Vue.input_message,obj,'');
            */
        }
    }catch(err){
        console.log(err);
    }
}

/*
    全局功能，信息提示
    参数：
        title:标题
        str:输出语句
        form:样式 of{
            "success"
            "info"
            "waring"
        }
        displaypostion:输出位置的标签id = "#main_alert_display"
*/
var Alert = (title,str,form,displaypostion="#main_alert_display")=>{
    var date = new Date();
    var time = date.getHours()+''+date.getMinutes()+date.getSeconds();
    $(displaypostion).append("<div class=\""+time+
    " bottonaddgpalert alert alert-"+form+" alert-dismissible fade show\" role=\"alert\" style=\"position:center;\">"+
    "<strong>"+title+"</strong> ，"+str+
    "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">"+
    "<span aria-hidden=\"true\">&times;</span></button></div>");
    $('.'+time).css({opacity:0.8});
    $("."+time).delay(1900).slideUp(700);
        //$("."+time).show('slow');
        //$("."+time).delay(1900).slideUp( 700 );
    console.log("."+time);
}


var ReadPartys = (order='uid')=>{
    maxuid = 0;
    window.GETALL_Party((party_rows)=>{
        for(index in party_rows){
            var uid = party_rows[index].uid;
            Vue.set(Party_Vue.Partys,uid,party_rows[index]);
            for(obj in Party_Vue.Partys[uid])
                if(Party_Vue.Partys[uid][obj]=='wq648a52vke1')
                    Party_Vue.Partys[uid][obj]='';
            console.log(party_rows[index]);
            if(Number(uid)>Number(maxuid))  maxuid = uid;
        }
    },order);
}
ReadPartys();


var ReadConstructions = (order='uid')=>{
    maxuid = 0;
    window.GETALL_Construction((construction_rows)=>{
        for(index in construction_rows){
            var uid = construction_rows[index].uid;
            Vue.set(Construction_Vue.Constructions,uid,construction_rows[index]);
            for(obj in Construction_Vue.Constructions[uid])
                if(Construction_Vue.Constructions[uid][obj]=='wq648a52vke1')
                    Construction_Vue.Constructions[uid][obj]='';
            console.log(construction_rows[index]);
            if(Number(uid)>Number(maxuid))  maxuid = uid;
        }
    },order);
}
ReadConstructions();

var ReadEquipments = (order='uid')=>{
    maxuid = 0;
    window.GETALL_Equipment((equipment_rows)=>{
        for(index in equipment_rows){
            var uid = equipment_rows[index].uid;
            Vue.set(Equipment_Vue.Equipments,uid,equipment_rows[index]);
            for(obj in Equipment_Vue.Equipments[uid])
                if(Equipment_Vue.Equipments[uid][obj]=='wq648a52vke1')
                    Equipment_Vue.Equipments[uid][obj]='';
            console.log(equipment_rows[index]);
            if(Number(uid)>Number(maxuid))  maxuid = uid;
        }
    },order);
}
ReadEquipments();


var ReadAlleviations = (order='uid')=>{
    maxuid = 0;
    window.GETALL_Alleviation((alleviation_rows)=>{
        for(index in alleviation_rows){
            var uid = alleviation_rows[index].uid;
            Vue.set(Alleviation_Vue.Alleviations,uid,alleviation_rows[index]);
            for(obj in Alleviation_Vue.Alleviations[uid])
                if(Alleviation_Vue.Alleviations[uid][obj]=='wq648a52vke1')
                    Alleviation_Vue.Alleviations[uid][obj]='';
            console.log(alleviation_rows[index]);
            if(Number(uid)>Number(maxuid))  maxuid = uid;
        }
    },order);
}
ReadAlleviations();





var ReadDogs = (order = 'uid')=>{
    maxuid = 0;
    window.GETALL_Dog((dog_rows)=>{
        for(index in dog_rows){
            var uid = dog_rows[index].uid;
            Vue.set(Dog_Vue.Dogs,uid,dog_rows[index]);
            for(obj in Dog_Vue.Dogs[uid])
                if(Dog_Vue.Dogs[uid][obj]=='wq648a52vke1')
                    Dog_Vue.Dogs[uid][obj]='';
            console.log(dog_rows[index]);
            if(Number(uid)>Number(maxuid))  maxuid = uid;
        }
    },order);
}
ReadDogs();
