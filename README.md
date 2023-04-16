## 文件结构

├── components                                // 自定义组件
├── config                                    // 参数配置文件
├── dist                                      // UI组件
├── pages                                     // 页面文件
│    ├── main                                 // 主目录
│    ├── item                                 // 项目（发票、合同、提成）
│    ├── apply                                // 申请
│    ├── examine                              // 审批
│    ├── note                                 // 日志
│    ├── system                               // 系统管理
│    ├── workCheck                            // 考勤
│    ├── role                                 // 角色权限
│    ├── addressBook                          // 通讯录（人员、部门）
│    └── user                                 // 登录、注册、找回密码等用户相关
├── static                                    //静态资源文件
│    ├── css                                  // 样式文件
│    ├── images                               // 图片文件
│    └── js                                   // JS文件
└── utils                                     // 公共资源文件

##页面路由
routes: [
    {
      path: '/',
      name: '/',
      redirect:'/index',
      component: Home,
    },
    {//登录
      name: 'login',
      path: '/login',
      component: login,
      meta:{
        'name':'登录'
      }
    },
    {//首页
      name: 'index',
      path: '/index',
      component: index,
      meta:{
        'name':'首页'
      }
    },
    {//注册
      name: 'regeist',
      path: '/regeist',
      component: regeist,
      meta:{
        'name':'注册'
      }
    },
    {//找回密码
      name: 'findPwd',
      path: '/findPwd',
      component: findPwd,
      meta:{
        'name':'找回密码'
      }
    },
    {
      name: '首页',
      path: '/home',
      redirect:'home/itemList',
      component: Home,
      children:[
      	{//资料情况
          name: 'dataInfo',
          path: 'dataInfo',
          component: dataInfo,
          meta:{
            'name':'资料情况',
            'module':'item',
            'dfItem':'itemList',
          }
        },
        {//工作任务安排
          name: 'taskPlan',
          path: 'taskPlan',
          component: taskPlan,
          meta:{
            'name':'工作任务安排',
            'module':'item',
            'dfItem':'itemList',
          }
        },
        {//项目开展情况
          name: 'itemState',
          path: 'itemState',
          component: itemState,
          meta:{
            'name':'项目开展情况',
            'module':'item',
            'dfItem':'itemList',
          }
        },
        {//项目列表
          name: 'itemList',
          path: 'itemList',
          component: itemList,
          meta:{
            'name':'项目列表',
            'module':'item',
            'dfItem':'itemList',
          }
        },
        {//新建项目
          name: 'addItem',
          path: 'addItem',
          component: addItem,
          meta:{
            'name':'新建项目',
            'module':'item',
            'dfItem':'itemList',
          }
        },
        {//分管领导审批
          name: 'leaderCheck',
          path: 'leaderCheck',
          component: leaderCheck,
          meta:{
            'name':'分管领导审批'
          }
        },
        {//部门经理审批
          name: 'managerCheck',
          path: 'managerCheck',
          component: managerCheck,
          meta:{
            'name':'部门经理审批'
          }
        },
        {//工程师反馈意见
          name: 'engineerCheck',
          path: 'engineerCheck',
          component: engineerCheck,
          meta:{
            'name':'工程师反馈意见'
          }
        },
        {//项目概况
          name: 'projectSurvey',
          path: 'projectSurvey',
          component: projectSurvey,
          meta:{
            'name':'项目概况',
            'module':'item',
            'dfItem':'itemList',
          }
        },
        {//项目经理录入项目要求
          name: 'projectDemand',
          path: 'projectDemand',
          component: projectDemand,
          meta:{
            'name':'项目经理录入项目要求（对内）',
            'module':'item',
            'dfItem':'itemList',
          }
        },
        {//项目经理选择工程师
          name: 'choiceEngineer',
          path: 'choiceEngineer',
          component: choiceEngineer,
          meta:{
            'name':'项目经理选择工程师'
          }
        },
        {//项目经理选择项目组成员
          name: 'choiceItemPeople',
          path: 'choiceItemPeople',
          component: choiceItemPeople,
          meta:{
            'name':'项目经理选择项目组成员',
            'module':'item',
            'dfItem':'itemList',
          }
        },
        {//项目经理录入或上传委托要求
          name: 'requirement',
          path: 'requirement',
          component: requirement,
          meta:{
            'name':'项目经理录入或上传委托要求',
            'module':'item',
            'dfItem':'itemList',
          }
        },
        {//复核人员审批
          name: 'itemReview',
          path: 'itemReview',
          component: itemReview,
          meta:{
            'name':'复核人员审批',
            'module':'item',
            'dfItem':'itemList',
          }
        },
        {//部门列表
          name: 'department',
          path: 'department',
          component: department,
          meta:{
            'name':'部门列表',
            'module':'role',
            'dfItem':'department',
          }
        },
        {//人员列表
          name: 'peopleList',
          path: 'peopleList',
          component: peopleList,
          meta:{
            'name':'人员列表',
            'module':'role',
            'dfItem':'department',
          }
        },
        {//合同列表
          name: 'contract',
          path: 'contract',
          component: contract,
          meta:{
            'name':'合同列表',
            'module':'item',
            'dfItem':'itemList',
          }
        },
        {//新增合同
          name: 'addContract',
          path: 'addContract',
          component: addContract,
          meta:{
            'name':'新增合同',
            'module':'item',
            'dfItem':'itemList',
          }
        },
        {//发票列表
          name: 'invoice',
          path: 'invoice',
          component: invoice,
          meta:{
            'name':'发票列表',
            'module':'item',
            'dfItem':'itemList',
          }
        },
        {//新增发票
          name: 'addInvoice',
          path: 'addInvoice',
          component: addInvoice,
          meta:{
            'name':'新增发票',
            'module':'item',
            'dfItem':'itemList',
          }
        },
        {//查看附件
          name: 'attachment',
          path: 'attachment',
          component: attachment,
          meta:{
            'name':'查看附件'
          }
        },
        {//角色列表
          name: 'role',
          path: 'role',
          component: role,
          meta:{
            'name':'角色列表',
            'module':'role',
            'dfItem':'itemList',
          }
        },
        {//项目提成
          name: 'commission',
          path: 'commission',
          component: commission,
          meta:{
            'name':'项目提成',
            'module':'item',
            'dfItem':'itemList',
          }
        },
        {//项目详情
          name: 'itemDetails',
          path: 'itemDetails',
          component: itemDetails,
          meta:{
            'name':'项目详情',
            'module':'item',
            'dfItem':'itemList',
          }
        },
        {//人员档案
          name: 'peopleFiles',
          path: 'peopleFiles',
          component: peopleFiles,
          meta:{
            'name':'人员档案',
            'module':'item',
            'dfItem':'itemList',
          }
        },
        {//申请列表
          name: 'applyList',
          path: 'applyList',
          component: applyList,
          meta:{
            'name':'申请列表',
            'module':'apply',
            'dfItem':'applyList',
          }
        },
        {//申请列表（请假申请）
          name: 'leaveApply',
          path: 'leaveApply',
          component: leaveApply,
          meta:{
            'name':'申请列表',
            'module':'apply',
            'dfItem':'applyList',
          }
        },
        {//申请列表（出差申请）
          name: 'businessApply',
          path: 'businessApply',
          component: businessApply,
          meta:{
            'name':'申请列表',
            'module':'apply',
            'dfItem':'applyList',
          }
        },
        {//申请列表（外出申请）
          name: 'gooutApply',
          path: 'gooutApply',
          component: gooutApply,
          meta:{
            'name':'申请列表',
            'module':'apply',
            'dfItem':'applyList',
          }
        },
        {//申请列表（加班申请）
          name: 'overtimeApply',
          path: 'overtimeApply',
          component: overtimeApply,
          meta:{
            'name':'申请列表',
            'module':'apply',
            'dfItem':'applyList',
          }
        },
        {//新增申请（日常申请）
          name: 'addApply1',
          path: 'addApply1',
          component: addApply1,
          meta:{
            'name':'新增申请',
            'module':'apply',
            'dfItem':'applyList',
          }
        },
        {//新增申请（请假申请）
          name: 'addApply2',
          path: 'addApply2',
          component: addApply2,
          meta:{
            'name':'新增申请',
            'module':'apply',
            'dfItem':'applyList',
          }
        },
        {//新增申请（出差申请）
          name: 'addApply3',
          path: 'addApply3',
          component: addApply3,
          meta:{
            'name':'新增申请',
            'module':'apply',
            'dfItem':'applyList',
          }
        },
        {//新增申请（外出申请）
          name: 'addApply4',
          path: 'addApply4',
          component: addApply4,
          meta:{
            'name':'新增申请',
            'module':'apply',
            'dfItem':'applyList',
          }
        },
        {//新增申请（加班申请）
          name: 'addApply5',
          path: 'addApply5',
          component: addApply5,
          meta:{
            'name':'新增申请',
            'module':'apply',
            'dfItem':'applyList',
          }
        },
        {//申请详情
          name: 'applyDetails',
          path: 'applyDetails',
          component: applyDetails,
          meta:{
            'name':'申请详情',
            'module':'apply',
            'dfItem':'applyList',
          }
        },
        {//日志列表
          name: 'noteList',
          path: 'noteList',
          component: noteList,
          meta:{
            'name':'日志列表',
            'module':'note',
            'dfItem':'noteList',
          }
        },
        {//新增日志
          name: 'addNote',
          path: 'addNote',
          component: addNote,
          meta:{
            'name':'新增日志',
            'module':'note',
            'dfItem':'noteList',
          }
        },
        {//修改日志
          name: 'editNote',
          path: 'editNote',
          component: editNote,
          meta:{
            'name':'修改日志',
            'module':'note',
            'dfItem':'noteList',
          }
        },
        {//补写日志
          name: 'repairNote',
          path: 'repairNote',
          component: repairNote,
          meta:{
            'name':'补写日志',
            'module':'note',
            'dfItem':'noteList',
          }
        },
        {//审批列表
          name: 'examineList',
          path: 'examineList',
          component: examineList,
          meta:{
            'name':'审批列表',
            'module':'examine',
            'dfItem':'examineList',
          }
        },
        {//审批详情（申请审批）
          name: 'examineDetails',
          path: 'examineDetails',
          component: examineDetails,
          meta:{
            'name':'审批详情（申请审批）',
            'module':'examine',
            'dfItem':'examineList',
          }
        },
        {//审批详情（项目经理审批）
          name: 'examineDetails2',
          path: 'examineDetails2',
          component: examineDetails2,
          meta:{
            'name':'审批详情（项目经理审批）',
            'module':'examine',
            'dfItem':'examineList',
          }
        },
        {//开关设置
          name: 'switchSet',
          path: 'switchSet',
          component: switchSet,
          meta:{
            'name':'开关设置',
            'module':'system',
            'dfItem':'switchSet',
          }
        },
        {//考勤
          name: 'workcheck',
          path: 'workcheck',
          component: workcheck,
          meta:{
            'name':'考勤',
            'module':'workcheck',
            'dfItem':'workcheck',
          }
        }
      ]
    }
  ]

## 微信BUG
- 当页面有textarea的时候，textarea填写内容，点击选择人员弹层，弹层不会遮盖住textarea的内容，这个时候需要弹层的时候隐藏textarea，关闭弹层再恢复，恢复后textarea的光标会出现在行首，这个时候需要用focus="{{textareaFocus}}"属性来让textarea重新获得焦点光标就会在行尾，当一个页面有多个textarea的时候，就要控制好哪个textarea获得焦点了。