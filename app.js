// TODO: 用户名称需修改为自己的名称
var userName = '隔壁嫩小王';
// 朋友圈页面的数据
var data = [{
  user: {
    name: '阳和',
    avatar: './img/avatar2.png'
  },
  content: {
    type: 0, // 多图片消息
    text: '华仔真棒，新的一年继续努力！',
    pics: ['./img/reward1.png', './img/reward2.png', './img/reward3.png', './img/reward4.png'],
    share: {},
    timeString: '3分钟前'
  },
  reply: {
    hasLiked: true,
    likes: ['Guo封面', '源小神', userName],
    comments: [{
      author: 'Guo封面',
      text: '你也喜欢华仔哈！！！'
    },{
      author: '喵仔zsy',
      text: '华仔实至名归哈'
    },{
      author: userName,
      text: '我最爱华仔！'
    }]
  }
}, {
  user: {
    name: '伟科大人',
    avatar: './img/avatar3.png'
  },
  content: {
    type: 1, // 分享消息
    text: '全面读书日',
    pics: [],
    share: {
      pic: 'http://coding.imweb.io/img/p3/transition-hover.jpg',
      text: '飘洋过海来看你'
    },
    timeString: '50分钟前'
  },
  reply: {
    hasLiked: false,
    likes: ['阳和'],
    comments: []
  }
}, {
  user: {
    name: '深圳周润发',
    avatar: './img/avatar4.png'
  },
  content: {
    type: 2, // 单图片消息
    text: '很好的色彩',
    pics: ['http://coding.imweb.io/img/default/k-2.jpg'],
    share: {},
    timeString: '一小时前'
  },
  reply: {
    hasLiked: false,
    likes:[],
    comments: []
  }
}, {
  user: {
    name: '喵仔zsy',
    avatar: './img/avatar5.png'
  },
  content: {
    type: 3, // 无图片消息
    text: '以后咖啡豆不敢浪费了',
    pics: [],
    share: {},
    timeString: '2个小时前'
  },
  reply: {
    hasLiked: true,
    likes:['隔壁嫩小王'],
    comments: []
  }
}];

// 相关 DOM
var $page = $('.page-moments');
var $momentsList = $('.moments-list');

/**
 * 点赞内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function likesHtmlTpl(likes) {
  if (!likes.length) {
    return '';
  }

  var  htmlText = ['<div class="reply-like"><i class="icon-like-blue"></i>'];
  // 点赞人的html列表
  var likesHtmlArr = [];

  // 遍历生成
  for(var i = 0, len = likes.length; i < len; i++) {
    likesHtmlArr.push('<a class="reply-who" href="#">' + likes[i] + '</a>');
  }

  // 每个点赞人以逗号加一个空格来相隔
  var likesHtmlText = likesHtmlArr.join(', ');
  htmlText.push(likesHtmlText);
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function commentsHtmlTpl(comments) {
  if (!comments.length) {
    return '';
  }

  var  htmlText = ['<div class="reply-comment">'];

  for(var i = 0, len = comments.length; i < len; i++) {
    var comment = comments[i];
    htmlText.push('<div class="comment-item"><a class="reply-who" href="#">' + 
    comment.author + '</a>：' + comment.text + '</div>');
  }

  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论点赞总体内容 HTML 模板
 * @param {Object} replyData 消息的评论点赞数据
 * @return {String} 返回html字符串
 */
function replyTpl(replyData) {
  var htmlText = [];
  htmlText.push('<div class="reply-zone">');
  htmlText.push(likesHtmlTpl(replyData.likes));
  htmlText.push(commentsHtmlTpl(replyData.comments));
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 多张图片消息模版 （可参考message.html）
 * @param {Array} pics 多图片消息的图片列表
 * @return {String} 返回html字符串
 */
function multiplePicTpl(pics) {
  var htmlText = [];
  htmlText.push('<ul class="item-pic">');

  for (var i = 0, len = pics.length; i < len; i++) {
    htmlText.push('<img class="pic-item" src="' + pics[i] + '">')
  }

  htmlText.push('</ul>');
  return htmlText.join('');
}
/**
 * 分享消息模版
 * @param {Object} shares 分享的内容
 * @return {String} 返回html字符串
 */
function shareMsgTpl(shares) {
  var htmlText = [];

  htmlText.push('<div class="item-share">');
  htmlText.push('<img class="share-img" src="'+shares.pic+'">');
  htmlText.push('<p class="share-tt">'+shares.text+'</p>');
  htmlText.push('</div>');

  return htmlText.join('');
}
/**
 * 单图片消息模版
 * @param {Array} pic 单张图片
 * @return {String} 返回html字符串
 */
function singlePicTpl(pic) {
  var htmlText = [];
  htmlText.push('<img class="item-only-img" src="'+pic[0]+'">');
  return htmlText.join('');
}
/**
 * 回复框模板
 * @param {Object} rp 回复相关信息
 * @return {String} 返回html字符串
 */
function replyBox(rp) {
  var htmlText = [];

  if (rp.hasLiked) {
    htmlText.push('<div class="reply-box">');
    htmlText.push('<span class="box-item-like"><i class="icon-like"></i>取消</span>');
    htmlText.push('<span class="box-item-comment"><i class="icon-comment"></i>评论</span>');
    htmlText.push('</div>');
  }
  else {
    htmlText.push('<div class="reply-box">');
    htmlText.push('<span class="box-item-like"><i class="icon-like"></i>点赞</span>');
    htmlText.push('<span class="box-item-comment"><i class="icon-comment"></i>评论</span>');
    htmlText.push('</div>');
  }

  return htmlText.join('');
}
/**
 * 评论输入框和按钮模板
 * @return {String} 返回html字符串
 */
function commenthtmlTpl() {
  var htmlText = [];

  htmlText.push('<div class="comment-box">');
  htmlText.push('<input type="text" placeholder="评论">');
  htmlText.push('<span>发送</span>')
  htmlText.push('</div>');

  return htmlText.join('');
}
/**
 * 循环：消息体
 * @param {Object} messageData 对象
 */
function messageTpl(messageData, dIndex) {
  var user = messageData.user;
  var content = messageData.content;
  var htmlText = [];
  htmlText.push('<div class="moments-item" data-index="'+dIndex+'">');
  // 消息用户头像
  htmlText.push('<a class="item-left" href="#">');
  htmlText.push('<img src="' + user.avatar + '" width="42" height="42" alt=""/>');
  htmlText.push('</a>');
  // 消息右边内容
  htmlText.push('<div class="item-right">');
  // 消息内容-用户名称
  htmlText.push('<a href="#" class="item-name">' + user.name + '</a>');
  // 消息内容-文本信息
  htmlText.push('<p class="item-msg">' + content.text + '</p>');
  // 消息内容-图片列表
  var contentHtml = '';
  // 目前只支持多图片消息，需要补充完成其余三种消息展示
  switch (content.type) {
      // 多图片消息
    case 0:
      contentHtml = multiplePicTpl(content.pics);
      break;
    case 1:
      // TODO: 实现分享消息
      contentHtml = shareMsgTpl(content.share);
      break;
    case 2:
      // TODO: 实现单张图片消息
      contentHtml = singlePicTpl(content.pics);
      break;
    case 3:
      // TODO: 实现无图片消息
      break;
  }
  htmlText.push(contentHtml);
  // 消息时间和回复按钮
  htmlText.push('<div class="item-ft">');
  htmlText.push('<span class="item-time">' + content.timeString + '</span>');
  //回复框
  htmlText.push(replyBox(messageData.reply));
  htmlText.push('<div class="item-reply-btn">');
  htmlText.push('<span class="item-reply"></span>');
  htmlText.push('</div></div>');
  // 消息回复模块（点赞和评论）
  htmlText.push(replyTpl(messageData.reply));
  htmlText.push('</div></div>');
  return htmlText.join('');
}


/**
 * 页面渲染函数：render
 */
function render() {
  // TODO: 目前只渲染了一个消息（多图片信息）,需要展示data数组中的所有消息数据。
  var messageHtml = [];

  for (var i = 0; i < data.length; i++){
    messageHtml[i] = messageTpl(data[i],i);
  }

  $momentsList.html(messageHtml.join(''));
  $page.append(commenthtmlTpl());
}


/**
 * 页面绑定事件函数：bindEvent
 */
function bindEvent() {
  // TODO: 完成页面交互功能事件绑定

  var $ft = $('.item-ft');
  var $currentBox;
  var $window = $(window);
  var $input = $('.comment-box input');
  var $rootitem;

  //绑定回复框显示/隐藏事件
  $ft.on('click', 'div.item-reply-btn', function () {
    var $box = $(this).siblings('div.reply-box');
    //单个回复框显示/隐藏的轮流切换
    if ($box.css('transform') === 'matrix(0, 0, 0, 1, 0, 0)') {
      $box.css('transform','scaleX(1)');
    }
    else {
      $box.css('transform','scaleX(0)');
    }
    //保证页面只显示一个回复框
    if ($currentBox && $currentBox[0] !== $box[0]) {
      $currentBox.css('transform','scaleX(0)');
    }

    $currentBox = $box;
  });


  //点赞/取消点赞
  $ft.on('click', 'span.box-item-like', function () {
    var $gradp = $(this).parents('.moments-item');
    //获取操作的数据下标
    var dindex = $gradp.attr('data-index');
    //更改属性值
    data[dindex].reply.hasLiked = data[dindex].reply.hasLiked === true ? false : true;
    $currentBox.css('transform','scaleX(0)');
    //在页面中往评论主体中添加用户
    var $like = $gradp.find('.reply-zone');

    if ($like.children('.reply-like')) {
        $like.children('.reply-like').remove();
    }

    if ($(this).text() === '点赞') {
      //往likes列表添加用户
      data[dindex].reply.likes.push(userName);
      $like.prepend(likesHtmlTpl(data[dindex].reply.likes));
      $(this).html('<i class="icon-like"></i>取消');
    }
    else {
      data[dindex].reply.likes.pop(userName);
      $like.prepend(likesHtmlTpl(data[dindex].reply.likes));
      $(this).html('<i class="icon-like"></i>点赞');
    }

  });


  //评论框的显示
  $ft.on('click', 'span.box-item-comment', function () {
    var pageWidth = $page.outerWidth();
    var $commentBox = $page.find('.comment-box');
    $rootitem = $(this).parents('.moments-item');
    $commentBox.css({
      'display': 'block',
      'width': pageWidth
    });
    $input.val('');
    //获取输入框的焦点
    $input[0].focus();
    $currentBox.css('transform','scaleX(0)');
  });


  //评论输入框
  $input.on('focus', function () {
    var $btn = $(this).siblings('span');
    if ($(this).val()) {
      $btn.removeClass('disabled');
      $btn.addClass('send-btn');
    }
    else {
      $btn.removeClass('send-btn');
      $btn.addClass('disabled');
    }
  });


  //往评论列表加入内容
  $('.comment-box').on('click', '.send-btn', function () {
    var text = $input.val();
    $input.val('');
    var dindex = $rootitem.attr('data-index');
    var newobj = {author: userName,text: text};
    var $replyComments = $rootitem.find('.reply-zone');
    if ($replyComments.children('.reply-comment')) {
      $replyComments.children('.reply-comment').remove();
    }

    data[dindex].reply.comments.push(newobj);
    $replyComments.append(commentsHtmlTpl(data[dindex].reply.comments));
    $('.comment-box').hide();
  });


  //发送按钮状态的变化
  $page.on('keyup', '.comment-box input', function () {
    var $btn = $(this).siblings('span');
    if ($(this).val()) {
      $btn.removeClass('disabled');
      $btn.addClass('send-btn');
    }
    else {
      $btn.removeClass('send-btn');
      $btn.addClass('disabled');
    }
  });


  //点击非回复操作面板的区域，隐藏回复操作面板
  $window.on('click', function (event) {
    var target = event.target;
    if (target.className !== 'item-reply' && 
        target.className !== 'item-reply-btn' &&
        target.className !== 'box-item-like' &&
        target.className !== 'box-item-comment' &&
        target.className !== 'reply-box' &&
        target.tagName !== 'I' && $currentBox) {
      $currentBox.css('transform','scaleX(0)');
    }
    if (target.className !== 'comment-box' &&
              target.className !== 'send-btn' &&
              target.className !== 'disabled' &&
              target.tagName !== 'INPUT' &&
              target.className !== 'box-item-comment' &&
              target.className !== 'icon-comment') {
      $('.comment-box').hide();
    }
  });
}


  //图片查看功能
  $momentsList.on('click', '.pic-item, .item-only-img', function () {
    var imgSrc = $(this).attr('src');
    console.log(imgSrc);
    $('.big-pic').attr('src',imgSrc);
    $('.big-warp').css('display','flex');
    $('.big-warp').fadeIn();
  });
  $('.big-warp').click(function(event) {
    $(this).fadeOut();
  });


/**
 * 页面入口函数：init
 * 1、根据数据页面内容
 * 2、绑定事件
 */
function init() {
  // 渲染页面
  render();
  bindEvent();
}

init();