paceOptions = {
    elements: true
};
var sfApp={
    sfSkrollr: null,
	isMobile:function(){
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            return true;
        }
        else
            return false;
    },
    recentPostsWidget:function(){
        if($('.recent-post').length){
            $('.recent-post').each(function(){
                var $this=$(this);
                var showPubDate=false;
                var showDesc=false;
                var descCharacterLimit=-1;
                var size=-1;
                var type='static';
                var slideMode='horizontal';
                var slideSpeed=500;
                var slidePager=false;
                var isTicker=false;
                var monthName=new Array();
                monthName[0]="Jan";
                monthName[1]="Feb";
                monthName[2]="Mar";
                monthName[3]="Apr";
                monthName[4]="May";
                monthName[5]="June";
                monthName[6]="July";
                monthName[7]="Aug";
                monthName[8]="Sept";
                monthName[9]="Oct";
                monthName[10]="Nov";
                monthName[11]="Dec";
                if($this.data('pubdate'))
                    showPubDate=$this.data('pubdate');
                if($this.data('desc')){
                    showDesc=$this.data('desc');
                    if($this.data('character-limit'))
                        descCharacterLimit=$this.data('character-limit');
                }
                if($this.data('size'))
                    size=$this.data('size');
                if($this.data('type'))
                    type=$this.data('type');
                if(type==='scroll'){
                    if($this.data('mode'))
                        slideMode=$this.data('mode');
                    if($this.data('speed'))
                        slideSpeed=$this.data('speed');
                    if($this.data('pager'))
                        slidePager=$this.data('pager');
                    if($this.data('ticker'))
                        isTicker=$this.data('ticker');
                }
                $.ajax({
                    type: 'GET',
                    url: rootUrl + '/rss/',
                    dataType: "xml",
                    success: function(xml) {
                        if($(xml).length){
                            var htmlStr='';
                            var date;
                            var count=0;
                            $('item', xml).each( function() {
                                if(size>0 && count < size){
                                    htmlStr += '<li class="clearfix">';                                    
                                    htmlStr += '<span class="icon"><i class="fa fa-file-text-o"></i></span>';
                                    htmlStr += '<span class="itemContent">';
                                    htmlStr += '<span class="title"><a href="' + $(this).find('link').eq(0).text() + '">' + $(this).find('title').eq(0).text() + '</a></span>';                                    
                                    htmlStr +='</span>';
                                    htmlStr += '</li>';
                                    count++;
                                }
                                else{
                                    return false;
                                }
                            });                            
                            htmlStr='<ul class="feedList static">'+ htmlStr + "</ul>";                            
                            $this.append(htmlStr);
                            sfApp.sidebarHeight();
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError);
                    }
                });
            });
        }
    },
    flickrWidget:function(){
        if($('.flickr-feed').length){
            $('.flickr-feed').each(function() {
                var $this=$(this);
                var flickr_id='';
                if($this.data('userid')){
                    flickr_id = $this.data('userid');
                }
                if(flickr_id == ''){
                    $this.html('<li><strong>Please enter Flickr user id before use this widget</strong></li>');
                }
                else{
                    var feedTemplate='<li><a href="{{image_b}}" target="_blank"><img src="{{image_m}}" alt="{{title}}" /></a></li>';
                    var size=15;
                    if( $this.data('size') )
                        size = $this.data('size');
                    var isPopupPreview = false;
                    if(  $this.data('popup-preview') )
                        isPopupPreview = $this.data('popup-preview');
                    if(isPopupPreview){
                        feedTemplate='<li><a href="{{image_b}}"><img src="{{image_m}}" alt="{{title}}" /></a></li>';
                    }
                    $this.jflickrfeed({
                        limit: size,
                        qstrings: {
                            id: flickr_id
                        },
                        itemTemplate: feedTemplate
                    }, function(data) {
                        if(isPopupPreview){
                            $this.imagesLoaded(function( instance ) {
                                sfApp.sidebarHeight();
                            });
                            $this.magnificPopup({
                                delegate: 'a',
                                type: 'image',
                                closeOnContentClick: false,
                                closeBtnInside: false,
                                mainClass: 'mfp-with-zoom mfp-img-mobile',
                                gallery: {
                                    enabled: true,
                                    navigateByImgClick: true,
                                    preload: [0,1] // Will preload 0 - before current, and 1 after the current image
                                },
                                image: {
                                    verticalFit: true,
                                    tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    instagramWidget: function(){
        if($('.instagram-feed').length){            
            $('.instagram-feed').each(function(){
                var $this=$(this);
                if( $this.data( 'userid' ) != '' && $this.data( 'api-token' ) != '' && $this.data( 'api-clientid' ) != '' ) {
                    $.fn.spectragram.accessData = {
                        accessToken: $this.data('api-token'),
                        clientID: $this.data('api-clientid')
                    };
                    var display=15;
                    var wrapEachWithStr='<li></li>';
                    if($(this).data('display'))
                        display=$(this).data('display');
                    $(this).spectragram('getUserFeed',{
                        query: $this.data( 'userid' ),
                        max: display
                    });
                    $this.imagesLoaded(function( instance ) {
                        sfApp.sidebarHeight();
                    });
                }
                else{
                    $(this).html('<li><strong>Please change instagram api access info before use this widget</strong></li>');
                }
            });
        }
    },
    dribbbleWidget: function(){
        if($('.dribbble-feed').length){
            $('.dribbble-feed').each(function(){
                var $this=$(this);
                var userId='';
                if($this.data('userid')){
                    userId = $this.data('userid');
                }
                if( userId != '' ){                    
                    var display=15;
                    if($this.data('display'))
                        display=$this.data('display');
                    var isPopupPreview=false;
                    if($this.data('popup-preview'))
                        isPopupPreview=$this.data('popup-preview');
                    $.jribbble.getShotsByPlayerId(userId, function (listDetails) {                        
                        var html = [];
                        $.each(listDetails.shots, function (i, shot) {
                            html.push('<li><a href="' + shot.url + '"><img src="' + shot.image_teaser_url + '" alt="' + shot.title + '"></a></li>');
                        });
                        $this.html(html.join(''));
                        $this.imagesLoaded(function( instance ) {
                            sfApp.sidebarHeight();
                        });
                        if(isPopupPreview){
                            $this.magnificPopup({
                                delegate: 'a',
                                type: 'image',
                                tLoading: 'Loading image #%curr%...',
                                closeOnContentClick: true,
                                closeBtnInside: false,
                                fixedContentPos: true,
                                mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
                                image: {
                                    verticalFit: true,
                                    tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
                                },
                                gallery: {
                                    enabled: true,
                                    navigateByImgClick: true,
                                    preload: [0,1] // Will preload 0 - before current, and 1 after the current image
                                }
                            });
                        }
                    }, {page: 1, per_page: display});
                }
                
            });
        }
    },
    facebookLikeWidget:function(){
        if($('.fb-like-box').length){
            (function(d, s, id){
                 var js, fjs = d.getElementsByTagName(s)[0];
                 if (d.getElementById(id)) {return;}
                 js = d.createElement(s); js.id = id;
                 js.src = "//connect.facebook.net/en_US/sdk.js";
                 fjs.parentNode.insertBefore(js, fjs);
               }(document, 'script', 'facebook-jssdk'));
        }
    },
    newsletterWidget:function(){
        if($('#mc-form').length){
            $("#mc-form input").not("[type=submit]").jqBootstrapValidation({
                submitSuccess: function ($form, event) {
                    event.preventDefault();                    
                    var url=$form.attr('action');
                    if(url=='' || url=='YOUR_WEB_FORM_URL_HERE')
                    {
                        alert('Please config your mailchimp form url for this widget');
                        return false;
                    }
                    else{
                        url=url.replace('/post?', '/post-json?').concat('&c=?');
                        var data = {};
                        var dataArray = $form.serializeArray();
                        $.each(dataArray, function (index, item) {
                            data[item.name] = item.value;
                        });
                        $.ajax({
                            url: url,
                            data: data,
                            success: function(resp){
                                if (resp.result === 'success') {
                                    alert("Got it, you've been added to our newsletter. Thanks for subscribe!");
                                }
                                else{
                                    alert(resp.result);
                                }
                            },
                            dataType: 'jsonp',
                            error: function (resp, text) {
                                console.log('mailchimp ajax submit error: ' + text);
                            }
                        });
                        return false;
                    }
                }
            });
        }
    },
    sidebarHeight:function(){
        // sidebar height
        if($(window).width()>768){
            var sidebarHeight=0;            
            if( $( '.body-content' ).height() > $( '.sidebar-wrap' ).height() ){
                
                sidebarHeight = $( '.body-content' ).outerHeight();             
            }
            else{
                sidebarHeight = $( '.sidebar-wrap' ).outerHeight()+50;                
            }       
            $('.sidebar').css({height: sidebarHeight});     
            $('.main-wrap').css({height: sidebarHeight});       
        }
    },
    introHeight:function(){
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        var percent=70;
        if(windowWidth<=600 || $('body').is('.error-template') ){
            percent=100;
        }        
        $('.intro').css({ 'height': Math.floor(windowHeight*percent/100) });
    },
    menuEvent:function(){
        if($('.mobile-nav-button').length){
            $('.mobile-nav-button').click(function(){                
                var $menu=$('.header .standard-nav');                
                if(!$(this).is('.active')){                    
                    $('body').addClass('open-menu');
                    $menu.addClass('open');
                    $(this).addClass('active');    
                    console.log('mm: ' + $menu.attr('class'));                
                }
                else{
                    $('body').removeClass('open-menu');
                    $menu.removeClass('open');
                    $(this).removeClass('active');
                    console.log('mm: ' + $menu.attr('class'));                
                }
            });
        }        
        if($('.sf-nav').length){
            var $menu=$('.sf-nav');
            var currentUrl=window.location.href;
            var $currentMenu=$menu.find('a[href="'+currentUrl+'"]');
            if($currentMenu.length){            
                $('li.active',$menu).removeClass('active');
                $currentMenu.parent().addClass('active');            
            }
        }
    },
    searchEvent:function(){
        if($('.search-button').length){
            $('.search-button').click(function(){
                $('#search-keyword').val('');
                var $search=$('.search-container');                
                if(!$(this).is('.active')){
                    $('body').addClass('open-search');
                    $search.addClass('open');
                    $(this).addClass('active');                    
                }
                else{
                    $('body').removeClass('open-search');
                    $search.removeClass('open');
                    $(this).removeClass('active');
                    $('.search-result').removeClass('searching');                    
                }
            });
        }
        if($('#search-keyword').length){
            $('#search-keyword').keypress(function(event) {            
                if (event.which == 13) {
                    if($('#search-keyword').val()!='' && $('#search-keyword').val().length>=3){                             
                        $('.search-result').html('<li class="loading-text">Searching ...</li>');
                        $('.search-result').addClass('searching');
                        sfApp.search($('#search-keyword').val());
                    }
                    else{
                        $('.search-result').html('<li class="loading-text">Please enter at least 3 characters!</li>');
                        $('.search-result').addClass('searching');
                    }
                }
            });
        }
    },
    scrollEvent:function(){

    },
    search:function(keyword){
        var hasResult=false;
        var page = 0;
        var maxPage=0;        
        if(keyword != ''){                  
            $.ajax({
                type: 'GET',
                url: rootUrl,
                success: function(response){
                    var $response=$(response);
                    var postPerPage=$response.find('section.post').length; 
                    var totalPage=parseInt($response.find('.total-page').html());
                    maxPage=Math.floor((postPerPage*totalPage)/15)+1;                                       
                    var timeout = setInterval(function(){
                        page=page+1;                
                        var ajaxUrl=rootUrl+'/rss/'+page+'/';
                        if(page==1){
                            ajaxUrl=rootUrl+'/rss/';
                        } 
                        if(page>maxPage){
                            clearInterval(timeout);
                            if(!hasResult){
                                $('.search-result .loading-text').html('Apologies, but no results were found. Please try another keyword!');
                            }
                        }
                        else{                                                                          
                            $.ajax({
                                type: 'GET',
                                url: ajaxUrl,
                                dataType: "xml",
                                success: function(xml) {
                                    if($(xml).length){                                                           
                                        $('item', xml).each( function() {                                                                          
                                            if($(this).find('title').eq(0).text().toLowerCase().indexOf(keyword.toLowerCase())>=0 ||
                                                    $(this).find('description').eq(0).text().toLowerCase().indexOf(keyword.toLowerCase())>=0){
                                                hasResult=true;
                                                if($('.search-result .loading-text').length){
                                                    $('.search-result .loading-text').remove();
                                                }
                                                $('.search-result').append('<li><a href="'+$(this).find('link').eq(0).text()+'">'+$(this).find('title').eq(0).text()+'</a></li>');
                                            }                    
                                        });
                                    }
                                }
                            });   
                        }             
                    }, 1000); 
                }
            });                                           
        }
    },	
    initUI:function(){
        sfApp.introHeight();
        sfApp.sidebarHeight();
    },
    fillNextPrevPostData:function(type,data){
        var $container = $('.next-prev-posts');
        $('.'+type,$container).attr('href',$(data).find('link').eq(0).text());
        $('.'+type,$container).attr('title',$(data).find('title').eq(0).text());
        $('.'+type+' h4',$container).html($(data).find('title').eq(0).text());
        $('.'+type,$container).addClass('has-result');
        var nextBoxHeight = $('.next',$container).outerHeight();
        var prevBoxHeight = $('.prev',$container).outerHeight();
        if(nextBoxHeight>prevBoxHeight){            
            $('.prev',$container).css({height: nextBoxHeight});
        }
        else{            
            $('.next',$container).css({height: prevBoxHeight});
        }
        $container.addClass('has-result');
        var $desc = $($(data).find('description').eq(0).text());
        if($desc.first().is('iframe')){
            var $iframeEl=$desc.first();
            var frameSrc=$desc.first().attr('src');
            if(frameSrc.indexOf('youtube.com')>=0){
                var regExp=/youtube(-nocookie)?\.com\/(embed|v)\/([\w_-]+)/;
                var youtubeId ='';
                var regResult= frameSrc.match(regExp);                                                
                if(regResult[3] != 'undefined' && regResult[3]!=''){
                    $('.'+type,$container).css('background-image', 'url("'+'http://i3.ytimg.com/vi/'+regResult[3]+'/0.jpg'+'")'); 
                    $('.'+type,$container).addClass('has-background');  
                }   
            }
            else if(frameSrc.indexOf('vimeo.com')>=0){                                                      
                var regExp = /video\/(\d+)/;                                                
                var regResult= frameSrc.match(regExp);
                if(regResult[1] != 'undefined' && regResult[1] != ''){
                    var vimeoUrl='http://vimeo.com/api/v2/video/'+regResult[1]+'.json';
                    console.log(vimeoUrl);
                    $.ajax({
                        type: 'GET',
                        url: vimeoUrl,
                        dataType: "json",
                        success: function(vimeoResult) {
                            if(vimeoResult.length){
                                $('.'+type,$container).css('background-image', 'url("'+vimeoResult[0].thumbnail_large+'")');  
                                $('.'+type,$container).addClass('has-background');                              
                            }
                        }
                    });
                }
            }
            // Audio Post By iframe
            else if(frameSrc.indexOf('soundcloud.com')>=0){                
                var regExp =/soundcloud.com\/tracks\/(\d+)/;                    
                var regResult= frameSrc.match(regExp);                        
                if(regResult.length && regResult[1]!=''){
                    $.ajax({
                        type: 'GET',
                        url: 'http://api.soundcloud.com/tracks/'+regResult[1]+'.json?client_id=425fc6ee65a14efbb9b83b1c49a87ccb',
                        dataType: "json",
                        success: function(result) {
                            if( result.artwork_url !=null && result.artwork_url != '' ) {
                                var artwork_url=result.artwork_url.replace('-large','-t500x500');
                                $('.'+type,$container).css('background-image', 'url("'+artwork_url+'")');  
                                $('.'+type,$container).addClass('has-background');
                            }
                        }
                    });
                }
            }     
        }                                        
        else if($desc.has('img[alt*="post-cover"]').length){
            var $backgroundEl = $desc.find('img[alt*="post-cover"]');
            if($backgroundEl.length){                                                
                $('.'+type,$container).css('background-image', 'url("'+$backgroundEl.attr('src')+'")');
                $('.'+type,$container).addClass('has-background');                
            }
        }                                        
        else if($desc.has('a[href*="youtube.com"]').length){                                            
            var $videoEl=$desc.find('a[href*="youtube.com"]');
            if($videoEl.length){
                var videoUrl=$videoEl.attr('href');
                if(videoUrl!=''){
                    var youtubeId = videoUrl.match(/[\\?&]v=([^&#]*)/)[1];
                    if(youtubeId!=''){
                        $('.'+type,$container).css('background-image', 'url("'+'http://i3.ytimg.com/vi/'+youtubeId+'/0.jpg'+'")');                        
                        $('.'+type,$container).addClass('has-background');
                    }
                }
            }
        }                                        
        else if($desc.has('a[href*="vimeo.com"]').length){                                                                            
            var $vimeoVideoEl=$desc.find('a[href*="vimeo.com"]');
            var vimeoVideoUrl=$vimeoVideoEl.attr('href');                                            
            var regExp = /vimeo.com\/(\d+)/;
            var vimeoId ='';
            var regResult= vimeoVideoUrl.match(regExp);
            if(regResult[1] != 'undefined' && regResult[1] != '') {                                                
                var vimeoUrl='http://vimeo.com/api/v2/video/'+regResult[1]+'.json';                                                
                $.ajax({
                    type: 'GET',
                    url: vimeoUrl,
                    dataType: "json",
                    success: function(vimeoResult) {                                                        
                        if(vimeoResult.length && vimeoResult[0].thumbnail_large != ''){
                            $('.'+type,$container).css('background-image', 'url("'+vimeoResult[0].thumbnail_large+'")');
                            $('.'+type,$container).addClass('has-background');
                        }
                    }
                });
            }
        }
        // Audio post by link structure
        else if( $desc.has('a[href*="soundcloud.com"]').length ) {                         
            var $audioEl=$desc.find('a[href*="soundcloud.com"]');            
            $.getJSON( 'http://api.soundcloud.com/resolve.json?url='+$audioEl.attr('href')+'&client_id=425fc6ee65a14efbb9b83b1c49a87ccb', function(data) {
                if( data.artwork_url !=null && data.artwork_url != '' ) {
                    var artwork_url=data.artwork_url.replace('-large','-t500x500');
                    $('.'+type,$container).css('background-image', 'url("'+artwork_url+'")');
                    $('.'+type,$container).addClass('has-background');
                }
            });                       
            
        }                
    },
    nextPrevPost:function(){
        if($('.next-prev-posts').length){
            var page = 0;
            var isFound=false;            
            var result = new Array();            
            var $prevPost = null;
            var $prevPostLastPage = null;
            var currentUrl = $('.next-prev-posts').data('current-url');
            console.log('process page: '+page);
            if(currentUrl != ''){
                var timeout = setInterval(function(){
                    page=page+1;
                    var ajaxUrl=rootUrl+'/rss/'+page+'/';
                    if(page==1){
                        ajaxUrl=rootUrl+'/rss/';
                    }
                    $.ajax({
                        type: 'GET',
                        url: ajaxUrl,
                        dataType: "xml",
                        success: function(xml) {
                            console.log('process page: '+page);
                            if($(xml).length){   
                                var total = $('item', xml).length;                                                        
                                $('item', xml).each( function(index, element) {                                    
                                    if(index==0){
                                        $prevPost = null;
                                    }                                    
                                    if(index>1){
                                        $prevPostLastPage = null;
                                    }
                                    if(index == total-1){
                                        $prevPostLastPage = $(element);   
                                    }                                                                        
                                    // Found next
                                    if(isFound){
                                        sfApp.fillNextPrevPostData('next',$(element));
                                        if($prevPostLastPage!=null){
                                            sfApp.fillNextPrevPostData('prev',$prevPostLastPage);
                                        }                                                                                              
                                        clearInterval(timeout);                                        
                                        return false;                     
                                    }
                                    else if(currentUrl == $(element).find('link').eq(0).text()){
                                        isFound = true;                                                          
                                        if(index>0){
                                            sfApp.fillNextPrevPostData('prev',$(xml).find('item').eq(index-1));                                                                                 
                                        }                      
                                    }                                    
                                });
                            }
                        }
                    });
                }, 2000);                                
            }
        }
    },
    initBlog:function(){
        $(".fancybox-thumb").fancybox({
            prevEffect  : 'none',
            nextEffect  : 'none',
            helpers : {
                title   : {
                    type: 'outside'
                },
                thumbs  : {
                    width   : 50,
                    height  : 50
                },
                overlay: {
                    locked: false
                }
            }
        });
        // Init list media
        if( $( '.post-list section .temp-content' ).length ) {
            $( '.post-list section .temp-content' ).each(function(){                
                var $this = $(this);
                var $postHeader = $(this).closest('.post-header');
                // Youtube video post by link structure
                if($this.has('a[href*="youtube.com"]').length){
                    var $videoEl=$this.find('a[href*="youtube.com"]');
                    if($videoEl.length){
                        var videoUrl=$videoEl.attr('href');
                        if(videoUrl!=''){
                            var youtubeId = videoUrl.match(/[\\?&]v=([^&#]*)/)[1];
                            if(youtubeId!=''){
                                if($('.post-list').is('.box-style') && !$postHeader.is('.has-background') ) {
                                    $postHeader.css('background-image', 'url("'+'http://i3.ytimg.com/vi/'+youtubeId+'/0.jpg'+'")');    
                                    $postHeader.addClass('has-background');
                                }                                
                                else if( $( '.post-list' ).is( '.stack-style' ) ) {
                                    var $postThumb = $postHeader.find('.post-thumb');
                                    if( !$postThumb.is('.has-thumb') ) {
                                        $postThumb.css('background-image', 'url("'+'http://i3.ytimg.com/vi/'+youtubeId+'/0.jpg'+'")');    
                                        $postThumb.addClass('has-thumb');                                    
                                    }                                    
                                }
                                else if( $('.post-list').is('.background-style' ) ) {
                                    var $section = $postHeader.closest('section');
                                    if( !$section.is('.has-background') ) {
                                        $section.css('background-image', 'url("'+'http://i3.ytimg.com/vi/'+youtubeId+'/0.jpg'+'")');    
                                        $section.addClass('has-background');
                                    }
                                }
                            }
                        }
                    }
                }
                // Youtube video post by iframe structure
                else if($this.has('iframe[src^="//www.youtube.com"]').length){
                    var $videoEl=$this.find('iframe[src^="//www.youtube.com"]');
                    var regExp=/youtube(-nocookie)?\.com\/(embed|v)\/([\w_-]+)/;                        
                    var regResult= $videoEl.attr('src').match(regExp);
                    if(regResult[3] != undefined && regResult[3]!=''){
                        if($('.post-list').is('.box-style') && !$postHeader.is('.has-background') ) {
                            $postHeader.css('background-image', 'url("'+'http://i3.ytimg.com/vi/'+regResult[3]+'/0.jpg'+'")');    
                            $postHeader.addClass('has-background');
                        }                                
                        else if( $( '.post-list' ).is( '.stack-style' ) ) {
                            var $postThumb = $postHeader.find('.post-thumb');
                            if( !$postThumb.is('.has-thumb') ) {
                                $postThumb.css('background-image', 'url("'+'http://i3.ytimg.com/vi/'+regResult[3]+'/0.jpg'+'")');    
                                $postThumb.addClass('has-thumb');                                    
                            }                                    
                        }
                        else if( $('.post-list').is('.background-style' ) ) {
                            var $section = $postHeader.closest('section');
                            if( !$section.is('.has-background') ) {
                                $section.css('background-image', 'url("'+'http://i3.ytimg.com/vi/'+regResult[3]+'/0.jpg'+'")');    
                                $section.addClass('has-background');
                            }
                        }
                    }
                }
                // Vimeo video post by link structure
                else if($this.has('a[href*="vimeo.com"]').length){
                    var $vimeoVideoEl=$this.find('a[href*="vimeo.com"]');
                    var vimeoVideoUrl=$vimeoVideoEl.attr('href');
                    var regExp = /vimeo.com\/(\d+)/;
                    var vimeoId ='';
                    var regResult= vimeoVideoUrl.match(regExp);
                    if(regResult.length && regResult[1] !='' ){
                        vimeoId=regResult[1];
                    }
                    if(vimeoId!=''){
                        if($('.post-list').is('.box-style') && !$postHeader.is('.has-background') ) {
                            $.ajax({
                                type: 'GET',
                                url: 'http://vimeo.com/api/v2/video/'+vimeoId+'.json',
                                dataType: "json",
                                success: function(result) {
                                    if(result.length){
                                        $postHeader.addClass('has-background');
                                        $postHeader.css('background-image', 'url("'+result[0].thumbnail_large+'")');                                                                                
                                    }
                                }
                            });
                        }                                
                        else if( $( '.post-list' ).is( '.stack-style' ) ) {
                            var $postThumb = $postHeader.find('.post-thumb');
                            if( !$postThumb.is('.has-thumb') ) {
                                $.ajax({
                                    type: 'GET',
                                    url: 'http://vimeo.com/api/v2/video/'+vimeoId+'.json',
                                    dataType: "json",
                                    success: function(result) {
                                        if(result.length){
                                            $postThumb.addClass('has-thumb');
                                            $postThumb.css('background-image', 'url("'+result[0].thumbnail_large+'")');                                                                                
                                        }
                                    }
                                });
                            }                                    
                        }
                        else if( $('.post-list').is('.background-style' ) ) {
                            var $section = $postHeader.closest('section');
                            if( !$section.is('.has-background') ) {
                                $.ajax({
                                    type: 'GET',
                                    url: 'http://vimeo.com/api/v2/video/'+vimeoId+'.json',
                                    dataType: "json",
                                    success: function(result) {
                                        if(result.length){
                                            $section.addClass('has-background');
                                            $section.css('background-image', 'url("'+result[0].thumbnail_large+'")');                                                                                
                                        }
                                    }
                                });                                
                            }
                        }
                    }
                }
                // Vimeo video post by iframe structure
                else if($this.has('iframe[src^="//player.vimeo.com"]').length){
                    var $vimeoVideoEl=$this.find('iframe[src^="//player.vimeo.com"]');
                    var vimeoVideoUrl=$vimeoVideoEl.attr('src');
                    var vimeoId ='';
                    var regExp = /video\/(\d+)/;
                    var regResult= vimeoVideoUrl.match(regExp);
                    if(regResult.length && regResult[1]!=''){
                        vimeoId=regResult[1];
                    }
                    if(vimeoId!=''){
                        if($('.post-list').is('.box-style') && !$postHeader.is('.has-background') ) {
                            $.ajax({
                                type: 'GET',
                                url: 'http://vimeo.com/api/v2/video/'+vimeoId+'.json',
                                dataType: "json",
                                success: function(result) {
                                    if(result.length){
                                        $postHeader.addClass('has-background');
                                        $postHeader.css('background-image', 'url("'+result[0].thumbnail_large+'")');                                                                                
                                    }
                                }
                            });
                        }                                
                        else if( $( '.post-list' ).is( '.stack-style' ) ) {
                            var $postThumb = $postHeader.find('.post-thumb');
                            if( !$postThumb.is('.has-thumb') ) {
                                $.ajax({
                                    type: 'GET',
                                    url: 'http://vimeo.com/api/v2/video/'+vimeoId+'.json',
                                    dataType: "json",
                                    success: function(result) {
                                        if(result.length){
                                            $postThumb.addClass('has-thumb');
                                            $postThumb.css('background-image', 'url("'+result[0].thumbnail_large+'")');                                                                                
                                        }
                                    }
                                });
                            }                                    
                        }
                        else if( $('.post-list').is('.background-style' ) ) {
                            var $section = $postHeader.closest('section');
                            if( !$section.is('.has-background') ) {
                                $.ajax({
                                    type: 'GET',
                                    url: 'http://vimeo.com/api/v2/video/'+vimeoId+'.json',
                                    dataType: "json",
                                    success: function(result) {
                                        if(result.length){
                                            $section.addClass('has-background');
                                            $section.css('background-image', 'url("'+result[0].thumbnail_large+'")');                                                                                
                                        }
                                    }
                                });                                
                            }
                        }
                    }
                }
                // Audio post by link structure
                else if( $this.has('a[href*="soundcloud.com"]').length ) {                         
                    var $audioEl=$this.find('a[href*="soundcloud.com"]');
                    if($('.post-list').is('.box-style') && !$postHeader.is('.has-background') ) {
                        $.getJSON( 'http://api.soundcloud.com/resolve.json?url='+$audioEl.attr('href')+'&client_id=425fc6ee65a14efbb9b83b1c49a87ccb', function(data) {
                            if( data.artwork_url !=null && data.artwork_url != '' ) {
                                var artwork_url=data.artwork_url.replace('-large','-t500x500');
                                $postHeader.css('background-image', 'url("'+artwork_url+'")');    
                                $postHeader.addClass('has-background');
                            }
                        });                       
                    }                                
                    else if( $( '.post-list' ).is( '.stack-style' ) ) {
                        var $postThumb = $postHeader.find('.post-thumb');
                        if( !$postThumb.is('.has-thumb') ) {                            
                            $.getJSON( 'http://api.soundcloud.com/resolve.json?url='+$audioEl.attr('href')+'&client_id=425fc6ee65a14efbb9b83b1c49a87ccb', function(data) {
                                if( data.artwork_url !=null && data.artwork_url != '' ) {
                                    var artwork_url=data.artwork_url.replace('-large','-t500x500');
                                    $postThumb.css('background-image', 'url("'+artwork_url+'")');    
                                    $postThumb.addClass('has-thumb');
                                }
                            });   
                        }                                    
                    }
                    else if( $('.post-list').is('.background-style' ) ) {
                        var $section = $postHeader.closest('section');
                        if( !$section.is( '.has-background') ) {
                            $.getJSON( 'http://api.soundcloud.com/resolve.json?url='+$audioEl.attr('href')+'&client_id=425fc6ee65a14efbb9b83b1c49a87ccb', function(data) {
                                if( data.artwork_url !=null && data.artwork_url != '' ) {
                                    var artwork_url=data.artwork_url.replace('-large','-t500x500');
                                    $section.css('background-image', 'url("'+artwork_url+'")');    
                                    $section.addClass('has-background');
                                }
                            }); 
                        }
                    }
                }
                // Audio Post By iframe
                else if($this.has('iframe[src^="https://w.soundcloud.com"]').length){
                    var $audioEl=$this.find('iframe[src^="https://w.soundcloud.com"]');
                    var regExp =/soundcloud.com\/tracks\/(\d+)/;                    
                    var regResult= $audioEl.attr('src').match(regExp);                        
                    if(regResult.length && regResult[1]!=''){
                        if($('.post-list').is('.box-style') && !$postHeader.is('.has-background') ) {
                            $.ajax({
                                type: 'GET',
                                url: 'http://api.soundcloud.com/tracks/'+regResult[1]+'.json?client_id=425fc6ee65a14efbb9b83b1c49a87ccb',
                                dataType: "json",
                                success: function(result) {
                                    if( result.artwork_url !=null && result.artwork_url != '' ) {
                                        var artwork_url=result.artwork_url.replace('-large','-t500x500');
                                        $postHeader.css('background-image', 'url("'+artwork_url+'")');    
                                        $postHeader.addClass('has-background');
                                    }
                                }
                            });                            
                        }                                
                        else if( $( '.post-list' ).is( '.stack-style' ) ) {
                            var $postThumb = $postHeader.find('.post-thumb');
                            if( !$postThumb.is('.has-thumb') ) {
                                $.ajax({
                                    type: 'GET',
                                    url: 'http://api.soundcloud.com/tracks/'+regResult[1]+'.json?client_id=425fc6ee65a14efbb9b83b1c49a87ccb',
                                    dataType: "json",
                                    success: function(result) {        
                                        if( result.artwork_url !=null && result.artwork_url != '' ) {
                                            var artwork_url=result.artwork_url.replace('-large','-t500x500');
                                            $postThumb.css('background-image', 'url("'+artwork_url+'")');    
                                            $postThumb.addClass('has-thumb');
                                        }                                        
                                    }
                                });                                   
                            }                                    
                        }
                        else if( $('.post-list').is('.background-style' ) ) {
                            var $section = $postHeader.closest('section');
                            if( !$section.is( '.has-background') ) {
                                $.ajax({
                                    type: 'GET',
                                    url: 'http://api.soundcloud.com/tracks/'+regResult[1]+'.json?client_id=425fc6ee65a14efbb9b83b1c49a87ccb',
                                    dataType: "json",
                                    success: function(result) {
                                        if( result.artwork_url !=null && result.artwork_url != '' ) {
                                            var artwork_url=result.artwork_url.replace('-large','-t500x500');
                                            $section.css('background-image', 'url("'+artwork_url+'")');    
                                            $section.addClass('has-background');
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
                else if($this.has('img[alt*="post-cover"]').length){
                    var $cover=$this.find('img[alt*="post-cover"]');
                    if($('.post-list').is('.box-style') && !$postHeader.is('.has-background') ) {
                        $postHeader.css('background-image', 'url("'+$cover.attr('src')+'")');    
                        $postHeader.addClass('has-background');
                    }                                
                    else if( $( '.post-list' ).is( '.stack-style' ) ) {
                        var $postThumb = $postHeader.find('.post-thumb');
                        if( !$postThumb.is('.has-thumb') ) {
                            $postThumb.css('background-image', 'url("'+$cover.attr('src')+'")');    
                            $postThumb.addClass('has-thumb');                                    
                        }                                    
                    }
                    else if( $('.post-list').is('.background-style' ) ) {
                        var $section = $postHeader.closest('section');
                        if( !$section.is( '.has-background') ) {
                            $section.css( 'background-image', 'url("' + $cover.attr('src') + '")' );    
                            $section.addClass( 'has-background' );
                        }
                    }
                }
            });
        }
        // Init single media
        if( $('.post-content' ).length ) {
            var $this = $('.post-content' );
            var $first = $this.find(">:first-child");            
            if( $first.length ){                                
                // Youtube video post by link structure
                if($first.has('a[href*="youtube.com"]').length){
                    var $videoEl=$first.find('a[href*="youtube.com"]');
                    if($videoEl.length){
                        var videoUrl=$videoEl.attr('href');
                        if(videoUrl!=''){
                            var youtubeId = videoUrl.match(/[\\?&]v=([^&#]*)/)[1];
                            if(youtubeId!=''){
                                $('.post-content' ).prepend('<iframe width="853" height="480" src="//www.youtube.com/embed/'+youtubeId+'" frameborder="0" allowfullscreen></iframe>');
                                $(".post-content").fitVids();
                                if(!$('.intro .intro-background').length) {
                                    $('.intro').append('<div class="intro-background" style="background-image: url(http://i3.ytimg.com/vi/'+youtubeId+'/0.jpg);" data-bottom-top="transform: translate3d(0px,-200px, 0px);" data-top-bottom="transform: translate3d(0px,200px, 0px);" data-center="transform: translate3d(0px,0px, 0px);"></div>');                                                        
                                    if(sfApp.sfSkrollr!=null){
                                        sfApp.sfSkrollr.refresh();
                                    }
                                }                                    
                            }
                        }
                    }
                }
                // Vimeo video post by link structure
                else if($first.has('a[href*="vimeo.com"]').length){
                    var $vimeoVideoEl=$first.find('a[href*="vimeo.com"]');
                    var vimeoVideoUrl=$vimeoVideoEl.attr('href');
                    var regExp = /vimeo.com\/(\d+)/;
                    var vimeoId ='';
                    var regResult= vimeoVideoUrl.match(regExp);
                    if(regResult.length && regResult[1] !='' ){
                        vimeoId=regResult[1];
                    }
                    if(vimeoId!=''){
                        $('.post-content' ).prepend('<iframe src="//player.vimeo.com/video/'+vimeoId+'?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
                        $(".post-content").fitVids();
                        if(!$('.intro .intro-background').length) {
                            $.ajax({
                                type: 'GET',
                                url: 'http://vimeo.com/api/v2/video/'+vimeoId+'.json',
                                dataType: "json",
                                success: function(result) {
                                    if(result.length){
                                        $('.intro').append('<div class="intro-background" style="background-image: url(' + result[0].thumbnail_large + ');" data-bottom-top="transform: translate3d(0px,-200px, 0px);" data-top-bottom="transform: translate3d(0px,200px, 0px);" data-center="transform: translate3d(0px,0px, 0px);"></div>');                                                                                            
                                        if(sfApp.sfSkrollr!=null){
                                            sfApp.sfSkrollr.refresh();
                                        }                                    
                                    }
                                }
                            });
                        }
                    }
                }
                // Audio post by link structure
                else if( $this.has('a[href*="soundcloud.com"]').length ) {                                       
                    var $audioEl=$this.find('a[href*="soundcloud.com"]');
                    $.getJSON( 'https://api.soundcloud.com/resolve.json?url='+$audioEl.attr('href')+'&client_id=425fc6ee65a14efbb9b83b1c49a87ccb', function(data) {                        
                        if( data.artwork_url !=null && data.artwork_url != '' ) {
                            $('.post-content' ).prepend('<div class="audio-iframe-wrap"><iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/'+data.id+'&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe></div>');                                               
                            if(!$('.intro .intro-background').length) {
                                $('.intro').append('<div class="intro-background" style="background-image: url('+data.artwork_url.replace('-large','-t500x500')+');" data-bottom-top="transform: translate3d(0px,-200px, 0px);" data-top-bottom="transform: translate3d(0px,200px, 0px);" data-center="transform: translate3d(0px,0px, 0px);"></div>');                                                                                               
                                if(sfApp.sfSkrollr!=null){
                                    sfApp.sfSkrollr.refresh();
                                }
                            }                                     
                        }
                    }); 
                }
                else if( $first.is( 'iframe' ) && !$('.intro .intro-background').length ) {                                        
                    var frameSrc=$first.attr('src');
                    if(frameSrc.indexOf('youtube.com')>=0){
                        var regExp=/youtube(-nocookie)?\.com\/(embed|v)\/([\w_-]+)/;
                        var youtubeId ='';
                        var regResult= frameSrc.match(regExp);                                                
                        if(regResult[3] != 'undefined' && regResult[3]!=''){                            
                            $('.intro').append('<div class="intro-background" style="background-image: url(http://i3.ytimg.com/vi/'+regResult[3]+'/0.jpg);" data-bottom-top="transform: translate3d(0px,-200px, 0px);" data-top-bottom="transform: translate3d(0px,200px, 0px);" data-center="transform: translate3d(0px,0px, 0px);"></div>');                                                             
                            if(sfApp.sfSkrollr!=null){
                                sfApp.sfSkrollr.refresh();
                            }
                        }   
                    }
                    else if(frameSrc.indexOf('vimeo.com')>=0){                                                      
                        var regExp = /video\/(\d+)/;                                                
                        var regResult= frameSrc.match(regExp);
                        if(regResult[1] != 'undefined' && regResult[1] != ''){
                            var vimeoUrl='http://vimeo.com/api/v2/video/'+regResult[1]+'.json';                            
                            $.ajax({
                                type: 'GET',
                                url: vimeoUrl,
                                dataType: "json",
                                success: function(vimeoResult) {
                                    if(vimeoResult.length){
                                        $('.intro').append('<div class="intro-background" style="background-image: url('+vimeoResult[0].thumbnail_large+');" data-bottom-top="transform: translate3d(0px,-200px, 0px);" data-top-bottom="transform: translate3d(0px,200px, 0px);" data-center="transform: translate3d(0px,0px, 0px);"></div>');                                                                
                                        if(sfApp.sfSkrollr!=null){
                                            sfApp.sfSkrollr.refresh();
                                        }                                        
                                    }
                                }
                            });
                        }
                    }
                    else if(frameSrc.indexOf('soundcloud.com')>=0){                          
                        var regExp =/soundcloud.com\/tracks\/(\d+)/;                    
                        var regResult= frameSrc.match(regExp);                        
                        if(regResult.length && regResult[1]!=''){
                            $.ajax({
                                type: 'GET',
                                url: 'http://api.soundcloud.com/tracks/'+regResult[1]+'.json?client_id=425fc6ee65a14efbb9b83b1c49a87ccb',
                                dataType: "json",
                                success: function(result) {
                                    if( result.artwork_url !=null && result.artwork_url != '' ) {
                                        $('.intro').append('<div class="intro-background" style="background-image: url('+result.artwork_url.replace('-large','-t500x500')+');" data-bottom-top="transform: translate3d(0px,-200px, 0px);" data-top-bottom="transform: translate3d(0px,200px, 0px);" data-center="transform: translate3d(0px,0px, 0px);"></div>');                                                               
                                        if(sfApp.sfSkrollr!=null){
                                            sfApp.sfSkrollr.refresh();
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
                else if($first.has('img[alt*="post-cover"]').length && !$('.intro .intro-background').length){
                    var $cover = $first.find('img[alt*="post-cover"]');
                    if($cover.length){
                        $('.intro').append('<div class="intro-background" style="background-image: url('+$cover.attr('src')+');" data-bottom-top="transform: translate3d(0px,-200px, 0px);" data-top-bottom="transform: translate3d(0px,200px, 0px);" data-center="transform: translate3d(0px,0px, 0px);"></div>');                        
                        if(sfApp.sfSkrollr!=null){
                            sfApp.sfSkrollr.refresh();
                        }
                    }                
                }
            }                          
        }
        if( $('body').is('.post-template' ) ){
            sfApp.nextPrevPost();                      
        }
    },
    gmapInitialize:function(){
        if($('.gmap').length){
            var your_latitude=$('.gmap').data('latitude');
            var your_longitude=$('.gmap').data('longitude');            
            var mainColor=sfApp.hexColor($('.gmap-container').css('backgroundColor'));
            var myLatlng = new google.maps.LatLng(your_latitude,your_longitude);
            var mapOptions = {
                zoom: 17,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                panControl: false,
                zoomControl: false,
                scaleControl: false,
                streetViewControl: false,
                scrollwheel: false,
                center: myLatlng,
                styles: [{"stylers":[{"hue": mainColor, "lightness" : 100}]}]
            }
            var map = new google.maps.Map(document.getElementById('gmap'), mapOptions);
            var markerIcon = new google.maps.MarkerImage(
                            rootUrl+'/assets/img/map-marker.png',
                            null, // size
                            null, // origin
                            new google.maps.Point( 32, 32 ), // anchor (move to center of marker)
                            new google.maps.Size( 64, 64 ) // scaled size (required for Retina display icon)
                        );            
            var marker = new google.maps.Marker({
                position: myLatlng,
                flat: true,
                icon: markerIcon,
                map: map,
                optimized: false,
                title: 'i-am-here',
                visible: true
            });
        }        
    },
    hexColor:function(colorval) {
        var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        delete(parts[0]);
        for (var i = 1; i <= 3; ++i) {
            parts[i] = parseInt(parts[i]).toString(16);
            if (parts[i].length == 1) parts[i] = '0' + parts[i];
        }
        return '#' + parts.join('');
    },
    misc:function(){
        if($('body').is('.post-template') || $('body').is('.page-template')){                      
            var $imgList=$('.post-content').find('img');
            if($imgList.length){
                $imgList.each(function(index, el) {
                    var alt=$(this).attr('alt');    
                    $(this).addClass('img-responsive'); 
                    $(this).addClass(alt);                       
                    if(alt.indexOf('no-responsive')>=0){                        
                        $(this).removeClass('img-responsive');
                    }
                });
            }
        }        
        if( !sfApp.isMobile() && $('body').data('parallax') ) {        
            sfApp.sfSkrollr = skrollr.init({
                forceHeight: false
            }); 
        }
        if($('.gmap').length){
            sfApp.gmapInitialize();
            google.maps.event.addDomListener(window, 'load', sfApp.gmapInitialize);
            google.maps.event.addDomListener(window, 'resize', sfApp.gmapInitialize);
        }
        $(".post-content").fitVids();
        
    },
    initWidget:function(){
        sfApp.recentPostsWidget();
        sfApp.flickrWidget();        
        sfApp.instagramWidget();
        sfApp.dribbbleWidget();
        sfApp.newsletterWidget();
        sfApp.facebookLikeWidget();
    },
    triggerEvents:function(){
        sfApp.menuEvent();
        sfApp.searchEvent();
        sfApp.scrollEvent();
    },
	init: function () {
        sfApp.initUI();
        sfApp.initBlog();        
        sfApp.initWidget();		
        sfApp.triggerEvents();
		sfApp.misc();
	}
};
/*================================================================*/
/*  2. Initialing
/*================================================================*/
$(document).ready(function() {
    "use strict";  
    sfApp.init();
});
window.fbAsyncInit = function () {
    FB.init({
        appId   : '703386019672770',
        status  : true,
        cookie  : true,
        xfbml   : true,
        version : 'v2.1'
    });
    FB.Event.subscribe("xfbml.render", function () {
        sfApp.sidebarHeight();
    });
};