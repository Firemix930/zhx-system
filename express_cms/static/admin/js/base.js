$(function () {

	app.init();
});

var app = {

	adminPath:"admin_express",
	init() {
		this.toggleAside();
		this.deleteConfirm();
		this.resizeIframe();
		this.changeStatus();
		this.changeNum();
	},
	deleteConfirm() {
		$('.delete').click(function () {
			var flag = confirm('Are you sure you want to delete?');
			return flag;
		});
	},
	resizeIframe() {
		var heights = document.documentElement.clientHeight - 100;
		var rightMainObj=document.getElementById('rightMain');
	
		if(rightMainObj){
			rightMainObj.height = heights;
		}
	
	},
	toggleAside() {
		$('.aside h4').click(function () {
			$(this).siblings('ul').slideToggle();
		})
	},
	changeStatus: function () {

		var adminPath=this.adminPath;
		$(".chStatus").click(function(){
			var id = $(this).attr("data-id");
			var model = $(this).attr("data-model");
			var field = $(this).attr("data-field");
			var el = $(this);
			$.get("/"+adminPath+"/changeStatus",{id:id,model:model,field:field},function(response){
				// console.log(response)
				if (response.success){
					if(el.attr("src").indexOf("yes")!=-1){
						el.attr("src", "/admin/images/no.gif");
					}else{
						el.attr("src", "/admin/images/yes.gif");
					}
				}
			})
		})
	},
	changeNum: function () {

		var adminPath=this.adminPath;
		$(".chSpanNum").click(function(){

			var id=$(this).attr("data-id");
			var model=$(this).attr("data-model");
			var field=$(this).attr("data-field");
			var spanEl=$(this);
			var spanNum=$(this).html();
			var input=$("<input value='' style='width:60px'/> ");			
			$(this).html(input);
			$(input).trigger('focus').val(spanNum);
			$(input).click(function(e){
				e.stopPropagation();				
			})
			$(input).blur(function(){				
				var inputNum=$(this).val();
				if(inputNum>0){
					spanEl.html(inputNum);
				}else{
					spanEl.html(0);
				}
				//Trigger request
				$.get("/"+adminPath+"/changeNum",{id:id,model:model,field:field,num:inputNum},function(response){				
					if(!response.success){
						console.log(response)
					}
				})

			})

		})
	}
};

$(window).resize(function () {
	app.resizeIframe()
})