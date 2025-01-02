B4A=true
Group=Default Group
ModulesStructureVersion=1
Type=Class
Version=9.86
@EndOfDesignText@
Sub Class_Globals
	'This is under development'
    Private Root As B4XView 'ignore
    Private xui As XUI 'ignore
 
    
    Private WebView1 As WebView
	Private WebViewExtras1 As WebViewExtras
    Private WebViewSetting1 As WebViewSettings
	Private WebChromeClient1 As DefaultWebChromeClient
    Private JavascriptInterface1 As DefaultJavascriptInterface

End Sub

'You can add more parameters here.
Public Sub Initialize

End Sub

Public Sub LoadWebPage(url As String)
	WebView1.LoadUrl(url)
End Sub

'This event will be called once, before the page becomes visible.
Private Sub B4XPage_Created (Root1 As B4XView)
	Root = Root1
	'load the layout to Root
	Root.LoadLayout("2")
	
 
 	
	JavascriptInterface1.Initialize
	WebViewExtras1.Initialize(WebView1)
	WebChromeClient1.Initialize("DefaultWebChromeClient1")
	
	'Webview Acceleration
	'NOTE: IF YOU USE ADMOB OR ANY AD NETWORK, ADD THIS SERIOUSLY FOR THE BEST PERFORMANCE! OR YOUR APP WOULD BE LAGGING
	Dim jo As JavaObject = WebView1
	jo.RunMethod("setLayerType", Array(2, Null))
	
	
	Dim WVJO As JavaObject = WebView1
	
	WVJO.RunMethod("setWebContentsDebuggingEnabled",Array(True))
	' Enable DOM Storage in WebView
	WebViewSetting1.SetDOMStorageEnabled(WebView1,True)
	'Remove zoom controls
	WebViewSetting1.SetDisplayZoomControls(WebView1,False)
	
	' Set the JavaScript interface for the WebView
	WebViewExtras1.addJavascriptInterface(JavascriptInterface1, "B4X")

	'WebView1.LoadUrl(Main.MyURL)
End Sub

 
 
Public Sub BT2WebView(str As String)
	WebViewExtras1.executeJavascript($"jBT2WebView('${str}')"$)
End Sub


Public Sub WebView2BT(str As String)	'WEB->BT
	B4XPages.MainPage.SendMessage(str)
End Sub

 
 

'Return True to close, False to cancel
Sub B4XPage_CloseRequest As ResumableSub
	If B4XPages.MainPage.ConnectionState = True Then
		Dim sf As Object = xui.Msgbox2Async("Disconnect?", "", "Yes", "", "No", Null)
		Wait For (sf) Msgbox_Result (Result As Int)
		If Result = xui.DialogResponse_Positive Then
			Log("Deleted!!!")
			B4XPages.MainPage.Disconnect
			Return True
		Else
			Return False
		End If
	End If
	Return True
End Sub

 