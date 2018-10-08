import React, { Component } from 'react';
import Header from '../components/Header';
import Head from 'next/head';
import cn from 'classnames';
import classNames from './about.css';
import ToTop from '../components/toTop';
import Footer from '../components/Footer';
import { pageTitle } from '../utils';

export default class aboutPage extends Component {
    constructor() {
        super();
        this.state = {
            jdActiveIndex: 0,
            jds: [{
                name: '1.商务专员（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、负责视频平台相关产品的商务工作，包括目标客户的开发、维护及跟进，达成制定的商务指标；',
                    '2、定期拜访目标客户，组织参加行业内交流会，充分了解各客户需求并积极跟进，制定视频产品的合理方案，负责方案提示、谈判，追踪公司相关部门的工作，保证项目方案的有效实施，做好数据收集；',
                    '3、维持与现有大客户的良好业务关系，及时更新平台产品信息，传达企业及品牌文化；',
                    '4、建立大客户档案，确保各项资料完整，准确，并做好动态管理。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、本科以上学历，有视频平台内容采购经验，有丰富的影视公司、视频平台资源，1年以上互联网视频应用相关工作相关经历；',
                    '2、了解互联网视频应用场景，了解视频行业相关服务，了解传统行业对互联网视频的需求有良好的互联网视频应用（互联网视频、广电、OTT、视频社交等）人脉资源优先；',
                    '3、了解互联网视频相关应用（点播、直播、CDN加速、音视频通信等）竞争态势的优先；',
                    '4、有工作热情，工作态度端正，具有良好的谈判能力和语言表达能力。',
                ],
            }, {
                name: '2.主持人（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、负责公司大型线上线下活动的主持、采访；',
                    '2、有良好的镜头感，在镜头前收放自如；',
                    '3、遵守公司规章制度，配合公司安排的活动；',
                    '4、临场思维敏捷，具有较强的语言表达能力和现场操控、应变能力。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、有丰富的的主持经验，5年以上同岗位工作经验优先，主持、播音专业优先；',
                    '2、有良好的语言素养，普通话标准，较强的英语口语能力；',
                    '3、有较强表演力，形象靓丽；',
                    '4、备一定的临场应变和即兴发挥能力。',
                ]
            }, {
                name: '3.节目编导（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、进行节目创意策划，制定节目模式；',
                    '2、根据节目模式，整理完成每期节目的台本（包括：主持人串词、采访提纲、嘉宾发言框架等）；',
                    '3、整理拍摄素材，选取所需内容，进行节目脚本的优化，输出可供后期剪辑的节目脚本。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、从事广告类、影视类节目编导工作2年以上，具有较强的语言表达能力，文笔出众；',
                    '2、写过营销视频、宣传片、新闻类、访谈类、广告类的脚本文案，有成功案例；（面试需带本人作品）；',
                    '3、 文字功底扎实，文笔流畅，思维灵敏，善于沟通，有创新意识；',
                    '4、具有一定的英语能力，学习能力强。',
                ]
            }, {
                name: '4.导播（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、 负责演播室的技术支持，参与节目制作直播导播工作；',
                    '2、 保证画面切换质量，控制失误率，保证镜头切换的美感及合理性；',
                    '3、 确保公司节目画面质量及播出安全；',
                    '4、 负责对演播室设备的日常养护；',
                    '5、 负责演播室设备的搭建。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、 大专以上学历，2年及以上相关经验；',
                    '2、热爱网综，并对相关节目的制作有一定认识；',
                    '3、 有电视直播转播相关经验者优先；',
                    '4、 具备优秀的沟通能力、学习能力及协调能力；',
                    '5、 对新技术有钻研精神，善于思考总结；',
                    '6、 抗压能力和应变能力强，对工作有强烈责任心。',
                ]
            }, {
                name: '5.视频剪辑师（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、精通PR、EDIUS、AE等剪辑软件；',
                    '2、熟练使用摄像机及相应的配套附件、有自己的原创作品；',
                    '3、对视频进行筛选、剪接、编辑、修饰、音频处理，能保质保量完成；',
                    '4、具有良好的审美，色彩搭配等专业技能。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、有作品或参与过影视（短视频、微电影、纪录片等）作品者优先考虑；',
                    '2、熟练掌握各种音、视频编辑软件；',
                    '3、能够独立完成宣传短片的制作，有良好的审美观和创意；',
                    '4、不拘于传统创作束缚，思维灵活。',
                    'PS：投递简历时请附带作品',
                ]
            }, {
                name: '6.影视特效合成师（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、根据导演要求独立完成影片数字合成；',
                    '2、配合公司其他部门完成相应的视频制作。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、有2年以上合成方面的工作经验；',
                    '2、熟悉精通合成相关软件；',
                    '3、有良好的艺术修养和非常热情的敬业精神；',
                    '4、熟悉后期制作流程；',
                    '5、有良好的美术基础。',
                ]
            }, {
                name: '7.三维灯光渲染师（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、负责三维动画、电影、游戏cg宣传片中的灯光、分层渲染和后期合成制作。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、	熟练掌握光线原理与应用，对利用灯光营造气氛拥有丰富的经验；',
                    '2、	有maya、nuke等软件的基本工作软件基础，熟悉以maya为平台的流程与制作；',
                    '3、熟练掌握Mental Ray，对优化场景渲染场景、分层渲染要熟练掌握；熟悉vray、arnold、redshift渲染器的使用，熟练各种渲染器的常见材质调整 ；',
                    '4、熟练使用合成软件，对人物抠像、合成、包装熟练掌握；',
                    '5、至少2年以上的影视制作经验；',
                    '6、具有良好的沟通能力和职业操守，有一定的抗压能力。',
                ]
            }, {
                name: '8.三维粒子特效师（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '根据影片需求负责完成影片中各种物理模拟，如粒子特效（云、烟、雾、爆炸、碎片等）、动力学模拟（刚体力学、柔体力学、毛发、布料等）、流体特效（水、血液、岩浆等）。',

                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、熟知影视动画制作流程，熟悉使用maya、3dmax、houdini的特效板块，精通houdini者优先，有mel或maxscript语言基础者优先；',
                    '2、能够独立完成影片中的特效处理，实现粒子、毛发、真实环境物理效果写实模仿；',
                    '3、清晰的项目制作周期规划，按期完成自己负责的镜头 ；',
                    '4、具备良好的美术基础，能完成cg特效元素的渲染与预合成；',
                    '5、具有优良的职业道德和工作责任心 ；',
                    '6、至少三年以上的影视特效制作经验；',
                    '7、具有良好的沟通能力，适应一定强度的工作压力。',
                ]
            }, {
                name: '9.资深品牌策划（苏州、北京）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、根据需求负责活动方案的主题创意策划、撰写活动的文案、创意及执行上线；',
                    '2、各项线上（新媒体）、线下宣传活动（发布会、媒体探班等）的策划、组织、统筹；',
                    '3、与合作伙伴联络、巩固，并维护、拓展媒体资源，与公司相关部门的协调和资源整合；',
                    '4、完成公司领导交办的其他工作。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、大学本科及以上学历，新闻学、心理学、哲学、人文等相关专业者优先；',
                    '2、擅长与人沟通，乐于拓展渠道；',
                    '3、能独立做品牌全案策划，有较为丰富的品牌管理经验，善于定目标拿结果；',
                    '4、善于资源整合，协作能力强；',
                    '5、有一定的战略眼光，对市场发展、品牌期望有预判能力。',
                ]
            }, {
                name: '10.活动策划（苏州、北京）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、根据推广需求策划活动方案，独立完成方案设定、创意、撰写；',
                    '2、制定活动实施计划及时间表，负责活动的执行、落地传播、跟踪、收尾结案；',
                    '3、协调整合各方资源，负责在活动过程中的多方对接，保证活动顺利完成；',
                    '4、活动结束后做好总结工作，针对方案在策划、宣传、实施情况、市场反映各个方面进行总结。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、大专及以上学历，市场营销、新闻学、广告学、传媒等相关专业优先；',
                    '2、3年以上大型活动策划执行工作经验者优先，吃苦耐劳，活动执行力强；',
                    '3、具备整体流程把控能力，执行和监控活动策划的执行及落地的各个环节；',
                    '4、具有良好的人际关系和沟通技巧，责任心强，有团队协作精神。',
                ]
            }, {
                name: '11.媒介运维（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、负责微信微博公众号及官方微博的运营推广，策划并执行微信微博日常活动及跟踪、维护；',
                    '2、提高有效粉丝数、粉丝活跃度，与粉丝互动，对粉丝的网络行为进行分析与总结；',
                    '3、挖掘和分析网友使用习惯、情感及体验感受，即时掌握新闻热点，能够完成专题活动策划；',
                    '4、分析微信微博运营效果，线上线下内容活动的策划与运营，提升影响力。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、本科以上学历，有2年以上相关工作经验；',
                    '2、具有较强的新闻、热点敏感性，有较强的文案功底；',
                    '3、有丰富的线上线下活动推广实操经验，熟悉口碑营销的执行操作流程；',
                    '4、网感好，创意优，执行力强，有良好的策略思考能力并能独立撰写方案，熟练使用图片处理软件；',
                    '5、熟悉互联网文化，微博、微信、论坛、SNS、豆瓣等资深用户；',
                    '6、	有良好团队合作精神；较强的执行力，独立思考能力 ，观察力和应变能力。',
                ]
            }, {
                name: '12.PR专员（苏州、北京）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、根据具体项目拟定整体传播方案，撰写传播规划，协调沟通相应的媒体资源，增加公司的曝光率；',
                    '2、维护并拓展媒介关系，紧密配合落实发布；',
                    '3、对公司重要热点工作时间的传播执行监控；',
                    '4、监控公关舆情，危机管理及处置。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、大专及以上学历，具有3年以上PR、品牌传播等相关工作经验；',
                    '2、具备良好的新闻敏感度和传播经验，有很强的策划能力和协作能力；',
                    '3、具有媒介渠道关系和资源，熟悉协调各种资源；',
                    '4、优秀的沟通能力和个人魅力，能够承受各方协作项目的工作压力；',
                    '5、相貌端正，会主持优先。',
                ]
            }, {
                name: '13.平面设计师（杭州、苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、较出色地独立完成各项设计任务，如媒体宣传稿件设计，公关活动创意画面设计、公关活动场地氛围布置规划设计，促销物料创意设计等；',
                    '2、与上级做良好沟通，积极主动、按时按质地完成符合品牌调性的创意设计工作；',
                    '3、负责产品制作、印刷过程质量监督，协助解决制作过程中的技术问题。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、广告行业工作经验，具有扎实的美术功底，良好的审美创意能力；',
                    '2、熟练操作Photoshop、Illustrator、CDR等相关设计软件，会使用3dmax者优先考虑，熟悉工艺材料、印刷、制作等工艺流程；',
                    '3、热爱设计，有很强的学习理解能力和敬业精神，较好的工作协调沟通能力，良好的团队合作精神；',
                    '4、投简历时请附上个人作品。',
                ]
            }, {
                name: '14.内容运营专员（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、根据APP、PC、TV运营策略和用户需求，策划内容方向；',
                    '2、负责内容编辑和用户维护；',
                    '3、提高内容质量，增加用户活跃度，提高用户粘性；',
                    '4、会视频剪辑或者爱好电影等（加分项）。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、一年以上工作经验；',
                    '2、大专以上学历，新闻、广告、中文等相关专业；',
                    '3、有编辑、策划、广告、产品等相关工作经验优先；',
                    '4、条件优秀的应届毕业生也可考虑。',
                ]
            }, {
                name: '15.渠道推广专员（杭州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、负责拓展国内知名APP、PC网站与有象视频的合作关系，对流量结果负责；',
                    '2、基于有象视频的资源，探索推进多种对外合作形式，并负责合作项目的整体运营管理；',
                    '3、在行业内推广有象视频，扩大有象视频的市场影响力；',
                    '4、对产品、商务拓展提出建设性意见。'
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、具有一年以上互联网行业工作经验，熟悉国内移动APP和PC网站，具有良好的人脉；',
                    '2、出色的沟通与商务谈判能力，以及强有力的执行能力。有项目管理经验者优先考虑；',
                    '3、具有较强的自驱力及学习能力；',
                    '4、能够承受较大的工作压力。',
                ]
            }, {
                name: '16.用户运营专员（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、负责app平台的用户运营，包括流量、留存度，活跃度、转化率等指标；',
                    '2、分析市场、竞品及用户行为，分析各个层级漏斗数据，不断完善产品功能，提升用户体验；',
                    '3、和产品协调沟通，推动UI、开发、运营等人协调达成优化目标。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、本科以上学历，有2年以上互联网用户运营经验；',
                    '2、有很强的沟通协调能力，谈判能力，独立思考及数据分析能力；',
                    '3、有较强的数据分析能力，创新意识强，把控用户需求。',
                ]
            }, {
                name: '17.高级产品经理（杭州、苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、负责互联网视频产品生命周期管理，包括 需求调研、需求分析、需求管理；',
                    '2、负责产品原型设计、用户交互设计，输出产品原型以及需求说明书；',
                    '3、视觉设计，开发，测试跟进，项目上线功能验收；',
                    '4、跟踪分析产品运营数据，定期对自身产品及行业、竞争对手等进行数据分析，评估、优化用户体验和功能。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、三年以上互联网行业同岗位工作经验，数据分析能力扎实，能较好地从数据中总结问题；',
                    '2、有互联网行业的产品经验，包括视频，音乐，各类直播秀等前台产品经验优先；',
                    '3、对产品工作有热情，积极主动，有责任感，了解草根网民喜好和互联网点播直播的产品形态具，有良好的团队合作精神；',
                    '4、对点播视频市场有沉淀的产品人员优先考虑，熟悉用户的互动方式、心理预期、付费动机，需要知晓各视频网站的内容输出类型和用户形成的理由。',
                ]
            }, {
                name: '18.UI设计师（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、负责产品的视觉设计，包括移动端、Web产品界面设计及上线海报等相关设计；',
                    '2、维护现有的应用产品，进行设计优化改进；',
                    '3、参与制定项目UI的详细设计规范，整理详细功能的设计规范文档；',
                    '4、负责线上推广活动设计；',
                    '5、参与新产品需求分析、创意，产品设计过程。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、本科及以上学历，美术、设计、艺术学等相关专业；',
                    '2、1～2年同等工作经验，有项目成功上线案例；',
                    '3、具备成熟的大局观念，可以在复杂的约束条件下找到平衡，并且推动团队持续提升设计质量；',
                    '4、	简历请附设计作品或者相关作品展示链接。',
                ]
            }, {
                name: '19.高级前端研发工程师（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、负责公司互联网视频产品的前端视觉、交互界面实现；',
                    '2、优化及维护现有前端项目；',
                    '3、搭建前端基础开发框架和组件。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、三年以上前端Javascript开发经验；',
                    '2、至少掌握一种web前端技术框架，至少使用过ReactJS，Node.js等；',
                    '3、JS的基础掌握扎实 , 熟悉JavaScript类库及主流JS/CSS框架，如 jQuery、Bootstrap、Less等；',
                    '4、对Android与iOS不同平台的HTML5页面性能优化、适配有丰富的经验；',
                    '5、有React Native的开发经验；',
                    '6、拥有良好的代码习惯，逻辑清晰，对团队进行技术指导，对解决技术难题有挑战精神。',
                ]
            }, {
                name: '20.高级IOS研发工程师（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、负责公司互联网视频产品iOS的研究及开发；',
                    '2、负责新技术的研究学习，能够适时引进新技术；',
                    '3、负责相应的BUG修复，善于总结思考，避免类似BUG的出现。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、三年及以上IOS开发经验，熟悉Mac OS 平台下的开发；熟悉算法思想，有较强的解决问题的能力，对OOD/OOP 有深刻的理解，具有良好的编程习惯；',
                    '2、精通C++/Objective C/Cocoa编程，熟练使用iPhone/iPad SDK及相关开发工具，熟悉IOS底层开发，研究性开发；',
                    '3、具备良好的沟通能力和团队合作精神，具备IOS上流媒体的开发经验者优先，有在App Store上发布软件者优先。',
                ]
            }, {
                name: '21.高级Android研发工程师（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、负责公司互联网视频产品Android的研究及研发；',
                    '2、负责新技术的研究学习，能够适时引进新技术；',
                    '3、负责相应的BUG修复，善于总结思考，避免类似BUG的出现。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、三年及以上Android开发经验，具有成熟Android APP产品开发经验者优先；',
                    '2、熟练掌握Andrroid SDK,Java,设计模式，http，多线程编程者优先；',
                    '3、熟悉Android Framwork,插件开发，有APP架构设计优先；',
                    '4、熟悉Android系统上的常用的性能调试工具者优先；',
                    '5、	分析问题和解决问题的能力强，有大规模代码的阅读和修改经验者优先。',
                ]
            }, {
                name: '22.高级Java研发工程师（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、负责公司互联网视频产品后台Java研究及研发；',
                    '2、负责各种相应的bug修复；',
                    '3、领导安排的其它设计工作。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、具有3年以上使用JAVA开发的经验；',
                    '2、具有深厚的专业技术基础，精通JAVA EE相关技术，熟悉Spring、SpringMVC、Struts、webwork、iBatis、Hibernate等开源框架及原理，熟悉Memcache/Couchbase、Redis、Zookeeper、MySQL、MongoDB、ActiveMQ、Elastic Search，熟悉JJAVA EE设计模式，熟悉Linux操作系统使用；',
                    '3、良好的编码习惯，能承受较大的工作压力；',
                    '4、较强的学习能力和解决问题的能力。',
                ]
            }, {
                name: '23.高级测试工程师（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、 参与各个评审会议，关注项目需求的合理性、可测试性；',
                    '2、主导设计或参与产品的功能测试，解决测试过程中的各种技术问题；',
                    '3、 根据现有的所有产品结构制定合理的自动化测试方案；',
                    '4、 负责制定方案，编写测试设计、执行测试，生成测试报告，并培训新人；',
                    '5、把控产品的质量和风险。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、三年以上高级或资深测试开发，有开发或者自动化测试经验，有以下相关经验优先：',
                    'Android/IOS开发基础，可进行codereview/白盒测试相关工作；自动化工具开发/改进，有效提升自动化稳定性/执行效率/开发效率，有自动化测试、后台测试，开发经验、接口测试者优先考虑熟悉Java/shell/python中至少一种语言；',
                    '2、熟悉测试流程和规范，数量掌握软件测试方法和常用测试工具，对软件测试工作有浓厚兴趣；',
                    '3、学习能力强，有较强分析、定位和解决问题的能力，具有较强的逻辑思维能力和表达能力。',
                ]
            }, {
                name: '24.高级运维工程师（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、负责公司产品的运维方案和架构设计、自动化运维和监控体系构建；',
                    '2、负责实际的线上服务器运维，并根据运维需要推动运维平台的建设；',
                    '3、对所负责的运维工作提出优化和改进，并有效推动落实；',
                    '4、根据研发部提供的上线文档进行独立的服务器端程序上线操作；',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、有大型互联网公司业务运维经验，熟悉主要的互联网运维解决方案；',
                    '2、熟悉Linux系统管理，具有Linux系统维护3年以上经验；',
                    '3、熟悉Shell或Python脚本编程，能自己编写运维脚本；',
                    '4、熟练zabbix,cacti等开源监控方案；',
                    '5、熟悉自动化运维工具fabric或puppet；',
                    '6、有mysql、redis、rabbitmq的运行维护经验；',
                    '7、具有较强的实际操作能力，具有分析、解决复杂问题的能力，具有较强的现场抗压力能力；',
                    '8、强烈的进取心和求知欲，善于学习和运用新知识；',
                    '9、	具有良好的敬业精神和团队协作能力，以及较好的沟通表达能力。',
                ]
            }, {
                name: '25.高级DBA（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、监控和优化数据库的性能，确保数据的安全运行；',
                    '2、制定数据库备份计划,灾难出现时对数据库信息进行恢复；',
                    '3、数据库故障分析，总结；',
                    '4、参与研发部系统设计时的数据库支撑，为系统提供性能保障；',
                    '5、公司内部数据库技术支持及服务器管理；',
                    '6、数据库培训，技术指导。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、良好的沟通能力，有较好的文字表达能力，具有一定的培训经验；',
                    '2、良好的职业道德与工作态度，团队合作精神、独立解决问题的能力和卓越的执行力；',
                    '3、熟悉关系型数据库理论，深刻理解3NF理论，有存储过程编写、sql调优经验，对各种关系型数据库有一定的了解，知道各自的优缺点；',
                    '4、熟悉Oracle、MySQL；熟悉linux日常操作与配置，会shell编程；熟悉redis缓存技术，mongodb等nosql技术；',
                    '6、	三年以上工作经验，有大数据分析经验者优先。',
                ]
            }, {
                name: '26.高级Python',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、精通linux下C/C++语言开发；',
                    '2、熟悉python语言，精通基于python语言的相应框架；',
                    '3、涉及嵌入式、网络、及密码算法等相关研发；',
                    '4、参与公司定制项目、公司产品的软件开发过程；',
                    '5、根据软件需求说明书和软件设计文档实现软件产品；',
                    '6、从事具体的软件开发，核心模块代码编写。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、计算机、通信、软件专业优先，本科以上学历；',
                    '2、三年以上软件开发经验者优先；',
                    '3、熟悉linux有嵌入式或网络开发经验者优先；',
                    '4、熟悉PHP语言及相关框架应用者优先；',
                    '5、态度端正、沟通能力良好，有一定的抗压能力；',
                    '6、 熟悉软件开发流程及良好文档编写能力；',
                    '7、能根据业务需求进行独立的系统设计和优化。',
                ]
            }, {
                name: '27.招聘专员（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、根据公司招聘需求，开展具体的招聘计划和招聘工作；',
                    '2、负责人才筛选、协助组织各类面试；',
                    '3、建立和维护公司人员招聘渠道；',
                    '4、及时发布招聘信息，积极开拓招聘渠道，满足公司的人才需求；',
                    '5、跟踪评估各类人才的使用情况，更新和维护人才储备库 ；',
                    '6、完成部门负责人交办的其他工作。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、本科以上学历，人力资源、工商管理、心理学、哲学等相关文科类专业优先；',
                    '2、一年以上招聘工作经验，熟悉招聘流程及各种招聘渠道；',
                    '3、熟练使用office办公软件及自动化设备，具备基本的网络知识；',
                    '4、良好的语言表达能力，沟通、协调能力强，具有明锐的洞察力及分析判断力；',
                    '5、性格外向，能够承受一定的工作压力。',
                ]
            }, {
                name: '28.人事专员（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、组织制定、执行、监督公司人事管理制度，完善人力资源管理各项事务的操作流程；',
                    '2、负责E－HR系统操作，维护、审核，更新等工作；',
                    '3、负责入离职、OA流程审核把控；',
                    '4、管理员工关系，处理和解决各种疑难劳动争议和纠纷。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、大学本科及以上学历，人力资源、企业管理等相关专业；',
                    '2、具有3年以上人力资源工作经验，尤其擅长社保、劳动法等法规；',
                    '3、熟练使用各类办公软件，具有较强的语言表达能力、解决问题的能力；',
                    '4、	具有较好的亲和力，较强的责任感与敬业精神。',
                ]
            }, {
                name: '29.法务专员（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、负责公司日常合同起草、初审及发起合同评审流程、跟进后续合同履行过程；',
                    '2、搜集、整理与公司业务领域相关的法律信息及动态，优化公司法律信息库；',
                    '3、负责合同的保管和借阅，提供日常法律咨询及法律服务；',
                    '4、负责联络、协调外部专业法律机构，协助处理公司法律纠纷的调解、仲裁、诉讼事务，配合上级主管或外聘律师工作；',
                    '5、完成领导交办的其他工作。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、大学本科及以上学历，法律相关专业；',
                    '2、具有2年以上公司法务或律所工作经验；',
                    '3、具备较强的文字书写能力，能够独立起草、审核和、修改各类合同及商务函件，熟练使用OFFICE办公软件；',
                    '4、具备良好职业道德素养、良好的执行能力及团队合作能力，细心谨慎，积极向上，学习能力强，能够承受较强的工作压力。',
                ]
            }, {
                name: '30.财务专员（苏州）',
                dutyTitle: '岗位职责：',
                duty: [
                    '1、每月编制合并层面的内部财务分析报告，为管理层提供决策信息支持；',
                    '2、为综合运营中心各部门提供财务运营支持；',
                    '3、领导安排的其他相关工作。',
                ],
                skillTitle: '任职要求：',
                skill: [
                    '1、会计、财务管理等相关专业本科以上学历；',
                    '2、3年以上相关工作经验，熟悉会计、税务相关法律法规，熟悉会计核算、财务分等日常财务工作；',
                    '3、熟练掌握excel、word、ppt办公软件以及用友或金蝶财务软件；',
                    '4、诚实、守信，作风严谨，坚持原则，具有良好的职业道德；',
                    '5、有良好的语言表达及分析、判断、沟通及组织协调能力，学习能力强；',
                    '6、有中级会计师、注册会计师、管理会计师（CMA）资格的优先考虑。',
                ]
            }
            ],
        };
        this.onClickJDRight = this.onClickJDRight.bind(this);
        this.onClickJDLeft = this.onClickJDLeft.bind(this);
    }

    onClickJDRight() {
        let nu = this.state.jdActiveIndex + 1;
        this.setState({
            jdActiveIndex: nu
        });
    }

    onClickJDLeft() {
        this.setState({
            jdActiveIndex: this.state.jdActiveIndex - 1
        });
    }

    render() {
        return (
            <div style={{ paddingTop: '60px' }}>
                <Head>
                    <title key='about-title'>{pageTitle}</title>
                    <meta name='keywords' content='有象视频官网, 有象, 有象视频, 视频, 视频网站, 电影, 综艺, 少儿, 电视剧, 直播, 高清视频, 在线观看' />
                    <meta name='description' content='有象视频，是金诚集团旗下杭州大象网络文化集团重点推出的综合性视频平台。依托于集团多年来在文化产业板块的深耕与布局，有象视频将自制、引入并聚合电影、电视剧、动漫、综艺、明星演唱会、竞技赛事、VR体验、在线直播等优质内容，打造一个“无广告、零插播、高清畅快”的全民VIP视频文化平台。' />
                </Head>
                <Header
                    hidexIndex = {false}
                    headStyle={{ height: 60 }}
                />
                <section className={classNames['header']}>
                </section>
                <section id='intro' className={cn(classNames['us-area'], classNames['white-bg'], classNames['about'])}>
                    <div className={classNames['main-content']}>
                        <div className={cn(classNames['container'])}>
                            <div className={classNames['iblock']}>
                                <div className={classNames['content-title']}>
                                    <div className={classNames['text-cover-bg']}/>
                                    <span className={classNames['text-eng']}>ABOUT US</span>
                                    <span className={classNames['text']}>关于我们</span>
                                </div>
                                <div className={classNames['content-text']}>
                                    <div className={cn(classNames['cube'], classNames['area-left'])}/>
                                    <div className={cn(classNames['desc'], classNames['area-right'])}>
                                        <p>有象视频，是金诚集团旗下杭州大象网络文化集团重点推出的综合性视频平台。</p>
                                        <br/>
                                        <p>依托于集团多年来对于文化产业板块的深耕与布局，有象视频将自制、引入并聚合电影、电视剧、动漫、综艺、明星演唱会、竞技赛事、VR体验、在线直播等优质内容，打造一个“无广告、零插播、高清畅快”的全民VIP视频文化平台。</p>
                                        <br/>
                                        <p>未来，有象视频将在多元化内容储备、个性化产品体验、IP资源孵化领域继续发力，为用户带来一场“泛娱乐”时代前所未有的网络视听盛宴。</p>
                                    </div>
                                </div>
                            </div>
                            <div className={classNames['iblock']}>
                                <div className={classNames['simulator']}>
                                    <img src='../static/image/about/simulator.png' alt='' />
                                </div>
                            </div>
                            <div className={classNames['iblock']}>
                                <div className={classNames['download']}>
                                    <img className={classNames['download-qr']} src='../static/image/about/download.png' alt='' />
                                    <a className={cn(classNames['iphone'], classNames['download-btn'])} href='https://itunes.apple.com/us/app/id1235011792?l=zh&ls=1&mt=8'>
                                        <img src='../static/image/about/ios-btn.png' alt='ios下载' />
                                    </a>
                                    <a className={cn(classNames['android'], classNames['download-btn'])} href='http://dx-downloads-test.itangchao.me/daxiang-live-A_OFFICAL-release.apk'>
                                        <img src='../static/image/about/android-btn.png' alt='android下载' />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={classNames['cooperate']} style={{ background: '#f9f9f9' }}>
                    <div className={classNames['main-content']}>
                        <p className={classNames['section-title']}>金诚集团文化产业历程及合作伙伴</p>
                        <div className={classNames['cooperate-desc']}>
                            <div className={classNames['hr-line']}>
                            </div>
                            <div className={classNames['cooperate-item']}>
                                <p>参与投资的浙江卫视2015一季度综艺节目《我看你有戏》正式开播。导师:冯小刚、成龙、张国立、李冰冰。</p>
                                <p>加盟蒙特利尔电影节，成为国内唯一赞助商，并与组委会共同举办了“杭州电影周”。</p>
                                <p>与加拿大Cavalia马戏团正式签订合作协议。</p>
                                <p>与时尚集团合作发行“时尚鸿蒙文化产业基金”，参与投资九州梦工厂、斗鱼TV、灵思云图等项目。</p>
                                <p>与加拿大全球沉浸式动感技术领军企业D-BOX实现战略合作。</p>
                                <p>金诚文化、芒果娱乐、华山论剑影视传媒、包贝尔工作室、天猫魔盒共同出品网络喜剧《欢喜密探》该剧以19亿的播放量收官。</p>
                                <p>收购韩国娱乐公司Fantagio，该公司旗下拥有包括徐康俊、HelloVenus女团、5urprise男团等明星。</p>
                                <p>独立制作网剧《神判包青天》。</p>
                            </div>
                        </div>

                        <ul>
                            <li>星辉海外有限公司</li>
                            <li>耀莱影视文化传媒有限公司</li>
                            <li>蒙特利尔电影节</li>
                            <li>加拿大Cavalia马戏团</li>
                            <li>加拿大动感技术领军企业D-BOX</li>
                            <li>韩国艺人公司Fantagio</li>
                            <li>九州梦工厂国际文化传播有限公司</li>
                            <li>斗鱼TV</li>
                            <li>浙江卫视</li>
                            <li>林心如工作室</li>
                            <li>包贝尔工作室</li>
                        </ul>
                    </div>
                </section>
                <section className={cn(classNames['white-bg'], classNames['works'])}>
                    <div className={classNames['main-content']}>
                        <p className={classNames['section-title']}>金诚集团相关作品</p>
                        <ul>
                            <li>
                                <img src='../static/image/about/poster-1.png' alt='《天将雄狮》' />
                                <span className={classNames['movie-title']}>《天将雄狮》</span>
                                <p>2015年春节档首日票房冠军</p>
                            </li>
                            <li>
                                <img src='../static/image/about/poster-2.png' alt='《既然青春留不住》' />
                                <span className={classNames['movie-title']}>《既然青春留不住》</span>
                                <p>华语电影票房冠军</p>
                                <p>创造33.9亿元票房记录</p>
                            </li>
                            <li>
                                <img src='../static/image/about/poster-3.png' alt='《美人鱼》' />
                                <span className={classNames['movie-title']}>《美人鱼》</span>
                                <p>入围2015年度加拿大</p>
                                <p>蒙特利尔国际电影节展映</p>
                            </li>
                            <li>
                                <img src='../static/image/about/poster-4.png' alt='《魔宫魅影》' />
                                <span className={classNames['movie-title']}>《魔宫魅影》</span>
                            </li>
                            <li>
                                <img src='../static/image/about/poster-5.png' alt='《西游伏妖篇》' />
                                <span className={classNames['movie-title']}>《西游伏妖篇》</span>
                                <p>2017年春节档票房冠军</p>
                            </li>
                        </ul>
                    </div>
                </section>
                <section className={cn(classNames['us-area'], classNames['join-us'])} id='join' style={{ background: '#f9f9f9' }}>
                    <div className={classNames['main-content']}>
                        <div className={cn(classNames['container'], 'clearfix')}>
                            <div className={classNames['iblock']}>
                                <div className={classNames['content-title']}>
                                    <div className={classNames['text-cover-bg']}></div>
                                    <span className={classNames['text-eng']}>JOIN US</span>
                                    <span className={classNames['text']}>加入我们</span>
                                </div>
                                <div className={classNames['content-text']}>
                                    <div className={cn(classNames['cube'], classNames['area-left'])}></div>
                                    <div className={cn(classNames['desc'], classNames['area-right'])}>
                                        <p>有象视频是杭州大象网络文化集团重点推出的全球视频网络与全域电视平台。</p>
                                        <br/>
                                        <p>平台以新型城镇化为依托，聚合全球优质文化资源，在为用户提供丰富、高清、流畅的专业视频体验的同时，打造多元化内容储备，引领视频体验改革，真正实现互联网产业与实体经济的融合。作为全球视频改革者，改变人类生活。</p>
                                    </div>
                                </div>
                            </div>
                            <div className={classNames['iblock']}>
                                <button onClick={this.onClickJDLeft} className={cn(classNames['btn'], classNames['btn-left'])}>
                                    <i className='icon iconfont icon-left'></i>
                                </button>
                                <div className={classNames['jd-detail']}>
                                    <p className={classNames['jd-title']}>{this.state.jds[this.state.jdActiveIndex].name}</p>
                                    <p className={classNames['jd-subtitle']}>{this.state.jds[this.state.jdActiveIndex].dutyTitle}</p>
                                    {this.state.jds[this.state.jdActiveIndex].duty.map((d, index) => {
                                        return <p key={index} className={classNames['line']}>{d}</p>;
                                    })}
                                    <p className={cn(classNames['jd-subtitle'], classNames['jd-secsubtitle'])}>{this.state.jds[this.state.jdActiveIndex].skillTitle}</p>
                                    {this.state.jds[this.state.jdActiveIndex].skill.map((d, index) => {
                                        return <p key={index} className={classNames['line']}>{d}</p>;
                                    })}
                                </div>
                                <button onClick={this.onClickJDRight} className={cn(classNames['btn'], classNames['btn-right'])}>
                                    <i className='icon iconfont icon-right'></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={cn(classNames['white-bg'], classNames['us-area'], classNames['contact'])} id='contact'>
                    <div className={classNames['main-content']}>
                        <div className={classNames['container']}>
                            <div className={classNames['content-title']}>
                                <div className={classNames['text-cover-bg']}></div>
                                <span className={classNames['text-eng']}>CONTACT US</span>
                                <span className={classNames['text']}>联系我们</span>
                            </div>
                            <div className={classNames['official']}>
                                <div>
                                    <span className={classNames['key']}>官方客服</span>
                                    <span className={classNames['number']}>400-058-0158</span>
                                </div>
                                <div className={classNames['mail-area']}>
                                    <span className={classNames['key']}>官方邮箱</span>
                                    <span className={classNames['mail']}>elephantgroup@126.com</span>
                                </div>
                            </div>
                            <div className={classNames['line']}></div>
                            <div className={classNames['contact-infos']}>
                                <div className={classNames['info']}>
                                    <p className={classNames['proj']}>节目合作：</p>
                                    <p>联系人：洪婷</p>
                                    <p>邮箱：hongting02@jcgroup.com.cn </p>
                                    <p>电话：0571-88337521</p>
                                </div>
                                <div className={classNames['info']}>
                                    <p className={classNames['proj']}>商务合作：</p>
                                    <p>联系人：俞佳丽</p>
                                    <p>邮箱：youxiang0210@jcgroup.com.cn</p>
                                    <p>电话：0571-88335639</p>
                                </div>
                                <div className={classNames['info']}>
                                    <p className={classNames['proj']}>版权投诉：</p>
                                    <p>联系人：徐北</p>
                                    <p>邮箱：youxiangbq@jcgroup.com.cn</p>
                                    <p>电话：0571-88335773</p>
                                </div>
                            </div>
                            <div className={classNames['imgs']}>
                                <div className={classNames['qrs']}>
                                    <img src='../static/image/about/qrs.png' alt='' />
                                </div>
                                <div className={classNames['map']}>
                                    <img src='../static/image/about/map.png' alt='地图' />
                                    <p>公司地址：杭州市拱墅区登云路43号金诚大厦3F</p>
                                    <p>邮编：310000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <ToTop/>

                <Footer/>
            </div>
        );
    }
}
