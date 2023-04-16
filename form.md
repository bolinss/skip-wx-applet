"appid": "wx0d5532f4c61bb4bb",//正式
----输入框----
<view class="inputLine">
	<view class="inputTitle">姓名</view>
	<input type="text" placeholder="请输入姓名" bindinput='getPhoneNumber'/>
	<view class="inputRight"></view>
</view>

----文本域---
<view class="textareaLine">
	<view class="textareaTitle">简介</view>
	<textarea placeholder='请输入简介'></textarea>
</view>

----单选框-----
<view class="inputLine">
	<view class="inputTitle">性别</view>
	<view class="radiobox">
		<radio-group class="radio-group" bindchange="radioChange">
			<label class="radio" >
				<radio value="男" checked="{{true}}" />男
			</label>
			<label class="radio" >
				<radio value="女" checked="{{false}}" />女
			</label>
		</radio-group>
	</view>
</view>

-----picker框--------
<view class="inputLine">
	<view class="inputTitle">类别</view>
	<picker bindchange="bindPickerChange" value="{{key}}" range="{{typeArray}}" range-key="{{'value'}}" class="pickerbox">
		<view class="picker">{{typeArray[0].value}}</view>
	</picker>
</view>

-------------内容显示（左右结构）-----------------
<view class="aline">
<view class="name">审批人：</view>
<view class="value">{{pageData.userName}}</view>
</view>

-------------内容显示2（左右结构，左侧加粗）-----------------
<view class="dfLine">
	<view class='name'>项目计划时间</view>
	<view class="content">2018-09-12 ~ 2018-09-20 共 8 天</view>
</view>


-------------内容显示3（左右结构,各占一半;不换行，超出显示...oneLine表示显示一行）-----------------
<view class="dfLine2 oneLine">
	<view class="line1">委托单位：{{item.entrustCompany?item.entrustCompany:'--'}}</view>
	<view class="line2">签订日期：{{item.contractDate?item.contractDate:'--'}}</view>
</view>


-----------普通按钮(dfBtnNoArr表示无箭头)--------------------
<view class="dfBtn dfBtnNoArr">
	按钮一
	<view class="rightText">右边字体</view>
</view>

-----------普通按钮2(左边不限文字长度，dfBtnNoArr表示无箭头)--------------------
<view class="dfBtn2 dfBtnNoArr">
	<view class="leftText">左边字体</view>
	<view class="rightText">右边字体</view>
</view>