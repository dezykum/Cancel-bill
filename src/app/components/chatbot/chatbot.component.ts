import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef , Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import * as AWS from 'aws-sdk';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { DataStoreService } from '../../services/data-store.service';
import { ActivatedRoute } from '@angular/router';




import {trigger, state, style, animate, transition, keyframes} from '@angular/animations';

@Component( {
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  animations: [
trigger('enterAnimation', [
  state('inactive', style({
    transform: 'translateY(100%)',
    opacity: 0
})),
state('active', style({
  transform: 'translateY(0%)',
  opacity: 1
})),
transition('inactive => active', animate('500ms', style({transform: 'translateY(0%)', opacity: 1}))),
transition('active => inactive', animate('500ms', style({transform: 'translateY(100%)', opacity: 0})))
])
],
  styleUrls: [ './chatbot.component.scss' ],
  encapsulation: ViewEncapsulation.Emulated
} )
export class ChatbotComponent implements OnInit {

  public message: string;
  public userMessageCollection: Array<string> = new Array;
  public chatConversation: Array<any> = new Array;
  public messageIndex: number;
  public isCaretUp: boolean;
  public isCaretDown: boolean;
  public state = 'active';
  public isStarDisabled = false;
  public intentName = '';
  public intentId = '';
  public displayStars:boolean = false;
  public displayCarousel: boolean = false;
  public carouselDataCollection = [];
  public carouselData = [];
  public selectedItem = '';
  public carouselList = [];
  public selectedIndex : any;
  public isIndexOne: boolean = false;
  public isCalender = false;
  public urlString = location.href;
  public typingStatement :boolean=false;
  public currenturl;

  paramval:{ name:String, intentnameVal: String};


  public myCredentials = new AWS.CognitoIdentityCredentials( { IdentityPoolId: 'us-east-1:2063fcc9-c31a-49bb-a2dd-c5511338e8bd' } );
    public config = new AWS.Config( {
        credentials: this.myCredentials,
        //accessKeyId:'AKIAJ3PX4W742KE2NQNA',
        //secretAccessKey:'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',

        region: 'us-east-1'
    } );
    public lexUserId = 'chatbot-demo' + Date.now(); ;
    public sessionAttributes = {};
    public parameters = {
      botAlias: 'CancelBillNew',
      botName: 'CancelBillNew',
      inputText: 'HI',
      userId: this.lexUserId,
      //sessionAttributes: this.sessionAttributes
  };

  constructor( public sanetizer: DomSanitizer,  private cdr: ChangeDetectorRef, public router: Router,private route: ActivatedRoute, public dataStore: DataStoreService ) {
    AWS.config.update( this.config );

}

  ngOnInit () {
   
   this.paramval={

    name:this.route.snapshot.params['name'],
    intentnameVal:this.route.snapshot.params['intentid'],
    //faq:this.route.snapshot.params['faq']

   }


   if(typeof this.paramval.intentnameVal==="undefined"){

    this.paramval.name='Ryan';
   }

  //  console.log("params" +this.route.snapshot.params['name'] + " intent" + this.paramval.intentnameVal );
  this.toggleChatBot(true);

  }

  buttonColor :string ="#ffffff";
  buttonTextColor :string ="#000000";

  buttonColor1 :string ="#ffffff";
  buttonTextColor1 :string ="#000000";

  buttonColor2 :string ="#ffffff";
  buttonTextColor2 :string ="#000000";

  buttonColor3 :string ="#ffffff";
  buttonTextColor3 :string ="#000000";

  buttonColor4 :string ="#ffffff";
  buttonTextColor4 :string ="#000000";

 button = [{ text: "Yes" },{ text: "No" }];
 addButton = [{ text: "All payments" },{ text: "Next payment" }];
 welcomebutton = [];
 
 

 slides = [
  {cardName: "CX Bank Mortgage", account: "Account *1001",amount: "£1,450 Scheduled for March 5, 2019", confirm:"Bill 1"},
  {cardName: "National Mobile", account: "Account *9999",amount: "£139.00 scheduled for March 10, 2019", confirm:"Bill 2"},
  {cardName: "City Water", account: "Account *1234",amount: "£35.00 scheduled for March 1, 2019", confirm:"Bill 3"}
 
];
 carousel = [{ text: "Yes",val: "../../assets/images/doc1.jpg" },{ text: "No",val: "../../assets/images/doc2.jpg" }];
 

 
  sendMessage ( postback?: any, event?: any ) {
    if ( this.message || postback ) {


      if(event!=undefined && event.srcElement.innerHTML.trim()=='Add to Cart' && this.selectedItem==''){

      }
      else{
        if ( postback ) {
          this.message = postback;
          if ( event && event.currentTarget.tagName === 'BUTTON' ) {
            
              event.target.parentNode.querySelectorAll( 'button' ).forEach( ele => {
                
                ele.disabled = true;
                if ( event.target !== ele ) {
                  ele.classList.remove( 'btn-primary' );
                  ele.classList.add( 'disabled' );
                }
              } );
          }
        } else {
          this.userMessageCollection.push( this.message );
          this.messageIndex = this.userMessageCollection.length;
          
		   this.chatConversation.push( {
            'from': 'user', 'message': this.message, 'timeStamp': this.getTime()
          } );
       
          this.getCaretPos();
        }
        this.createChatConversation();
      }
      this.message = null;
    }
  }


  buttonClick(button){
    this.message =button;
    this.chatConversation.push( {
      'from': 'user', 'message': this.message
    } );
    this.sendMessage(button);

  }

  confirmButtonClick(slide){
    if(slide == 'Bill 2'){
      this.message="National Mobile"
    }
    this.message =slide;
    this.chatConversation.push( {
      'from': 'user', 'message': this.message
    } );
    this.sendMessage(slide);
  }


  buttonClick1(button){
    this.message =button.text;
    this.buttonColor = '#F4F4F6';
    this.buttonTextColor ='#F4F4F6';
    this.chatConversation.push( {
      'from': 'user', 'message': this.message
    } );
    this.sendMessage(button.postback);

  }

  addButtonClick(addButtons){
    this.message =addButtons;
    this.buttonColor1 = '#F4F4F6';
    this.buttonTextColor1 ='#F4F4F6';
    this.chatConversation.push( {
      'from': 'user', 'message': this.message
    } );
    this.sendMessage(addButtons);

  }

  

  addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
  changeFunc(event){
    var newdateValue=event.value;
    var newdate = newdateValue.getFullYear() + '/' +(newdateValue.getMonth() + 1) + '/' + newdateValue.getDate()
    this.sendMessage(newdate);
    this.message =newdate
    this.chatConversation.push( {
      'from': 'user', 'message': this.message

    } );

    this.message = null;
  }
 
  changeTime(event){
    var newTime = event.value;
   var  hours=this.addZero(newTime.getHours());
   var  minute=this.addZero(newTime.getMinutes());
   var amOrPm = (newTime.getHours() < 12) ? "AM" : "PM";
    var newTimeValue=hours + ":" + minute +   amOrPm;
	console.log(newTimeValue)
    this.sendMessage(newTimeValue);
    this.message = newTimeValue;
    this.chatConversation.push( {
      'from': 'user', 'message': this.message
    } );
    this.message = null;
  }


  createChatConversation () {

    const isEoc = this.message === 'call customer agent';
  const params = Object.assign( {}, this.parameters, { inputText: this.message } );

   const lexruntime = new AWS.LexRuntime();
   lexruntime.config.update( this.config );
   lexruntime.postText( params, ( err, data ) => {

  
      if ( err ) {
        console.log( 'error' + err );
    }
   if ( data ) {
      let res =JSON.stringify(data)

        this.sessionAttributes = data.sessionAttributes;
        //console.log(JSON.stringify(data)+ "new way");
        var newbotresponse = data.message;
        if(newbotresponse.includes("<br />")){
          var storedresponseValue = newbotresponse.split('<br />');
        for(var i=0; i <storedresponseValue.length; i++){

          var newValueBot;
          newValueBot = storedresponseValue[i];
          
            this.chatConversation.push( {
              'from': 'bot', 'message': newValueBot, 'slotToElicit': data.slotToElicit, 'intentName':data.intentName,'dialogState': data.dialogState
              
            } );
           

        }

        }

else{
 
  
        
          setTimeout(()=>{
          this.chatConversation.push( {
            'from': 'bot', 'message': data.message, 'slotToElicit': data.slotToElicit, 'intentName':data.intentName,'dialogState': data.dialogState

          } );
        }, 2000);  
     
    }     
    }


      let messages = [];
      let buttons = [];
      let radio = [];
	  let dropdown=[];//adeed here for dropdown


      messages.forEach( ( message, index ) => {
        if(message=="How would you rate your overall experience?"){
          this.isStarDisabled = false;
        }
        setTimeout( () => {
          //this.chatConversation.pop();
          const messageBody = {
            'from': isEoc ? 'agent' : 'bot', 'message': message, 'buttons': ( index !== 0 || messages.length === 1 ) ? buttons : undefined,
			'dropdown': ( index !== 0 || messages.length === 1 ) ? dropdown : undefined,//adeed here for dropdown
            timeStamp: this.getTime(), 'intentId': this.intentId, 'intentName': this.intentName, 'displayStars': (message==" How would you rate your overall experience?" ? true : false),
            messageIndex : index
          };

          

          
          var closeMsg = this.message;
    if ((closeMsg.toLowerCase() =='bye') || (closeMsg.toLowerCase() =='good bye')){
      this.toggleChatBot(false);
    }
    this.message = null;
    this.showResponsePreloader();

          this.chatConversation.push( messageBody );
          if ( messages.length > 1 && index + 1 < messages.length ) {
            this.showResponsePreloader();
            this.selectedIndex = 10;
          }
          this.cdr.detectChanges();
        }, isEoc ? 5000 : 2000 * ( index + 1 ) );
      } );
    } );

  }

  
 
  public getCurrentTime () {
    
  //var newName = this.paramval.name;
   var nameValue= this.paramval.name.substring(0, 1).toUpperCase() + this.paramval.name.substring(1);
    const d = new Date();
    const time = d.toLocaleTimeString();
    const currentTime = { time: time, message: '' };
    if ( d.getHours() < 12 ) {
        currentTime.message = nameValue + '! <br/>';
    } else if ( d.getHours() <= 12 && d.getHours() < 16 ) {
        currentTime.message = nameValue + '<br/>';
    } else {
        currentTime.message = nameValue + '!<br/>';
    }
    return currentTime;
}

  showResponsePreloader () {
    this.chatConversation.push( {
      'from': 'bot', message: '<img class="mx-auto loader" src="./assets/images/loading.gif" />',
      timeStamp: this.getTime()
    } );
  }

  getMessageHistory ( func: string ) {
    const currentMessage = this.message;
	if(this.messageIndex ==0){
		console.log("hi");
	}
    if ( this.messageIndex > 0 && func === 'up' ||
      ( this.messageIndex >= 0 && this.messageIndex < this.userMessageCollection.length - 1 && func === 'down' ) ) {
      this.messageIndex = func === 'up' ? this.messageIndex - 1 : this.messageIndex + 1;
    }
    this.message = this.messageIndex === this.userMessageCollection.length ?
      currentMessage : this.userMessageCollection[ this.messageIndex ];
    this.getCaretPos();
  }

  getTime (): string {
    const date = new Date;
    return date.toLocaleString( 'en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    } );
  }

  getCaretPos (): void {
    this.isCaretUp = !!( this.messageIndex > 0 );
    this.isCaretDown = !!( this.userMessageCollection.length - this.messageIndex > 1 );
  }

  minimizeChatBot(value: boolean){

    if(value){
      this.state = 'active';
    }
    else{
      this.state = 'inactive';
    }

  }




  toggleChatBot(value: boolean) {

   

  if (value) {
     this.state = 'active';
     var botDefaultresponse ='Hi' + ' ' + this.getCurrentTime().message  + ' '+ ' I see you want to cancel a bill. Is that right?';
     this.welcomebutton = [{ text: "Yes",postback: 'Yes' }, {text: "No", postback: "No"}];
         var messageBody2 = {
          'from': 'bot', 'message': botDefaultresponse, 'button': this.welcomebutton, 'intentName' : 'defaultIntent'
         };
  this.chatConversation.push(messageBody2);
     
     // var testButton = [];
    if(this.paramval.intentnameVal==='scheduleappt'){

      botDefaultresponse= this.getCurrentTime().message  + ' '+  ' I understand that you are looking for a new OB/Gyn physician.  I can help you with that.  Would you prefer';
       this.welcomebutton = [{ text: "Male",postback: 'male' }, {text: "Female", postback: "female"}, {text: "No Preference", postback: "No prefrence"}];
       var messageBody1 = {
         'from': 'bot', 'message': botDefaultresponse, 'button': this.welcomebutton, 'intentName' : 'defaultIntent'
              };
this.chatConversation.push(messageBody1);

    }
    else if(this.paramval.intentnameVal==='recordrequest'){

      botDefaultresponse= this.getCurrentTime().message + ' '+ " it looks like you haven't logged into your patient portal before. I can help you setup your login. Click on the following link to go to the login screen. Enter the username of Jane.Doe and click the link for a first time user. <br /><a href='https://www.geisinger.org/mygeisinger' target='_blank'><h3 style=color:black;><u>https://www.geisinger.org/mygeisinger</u></h3></a><br /> Were you able to login?" 
        this.welcomebutton = [{ text: "Yes",postback: 'this is test' }, {text: "No", postback: "No"}];
         var messageBody2 = {
          'from': 'bot', 'message': botDefaultresponse, 'button': this.welcomebutton, 'intentName' : 'defaultIntent'
         };
  this.chatConversation.push(messageBody2);
      

    }
    else if (this.paramval.intentnameVal==='billinq'){

      botDefaultresponse= this.getCurrentTime().message  + ' '+  "I have your account pulled up. Currently we have Aetna listed as your primary insurance.  What information do we need to update?"
       var messageBody3 = {
         'from': 'bot', 'message': botDefaultresponse
       };
this.chatConversation.push(messageBody3);

    }

     if(this.chatConversation.length){ }
     else{

    setTimeout(()=>{
       this.chatConversation.push( {
         'from': 'bot', 'message': botDefaultresponse

        } );
    }, 600);
    

     }


   } else {
     this.state = 'inactive';
     this.chatConversation.length=0;
   }
 }
 ngAfterViewInit() {
  this.cdr.detectChanges();
}


selectItem(itemName,item){
  // console.log(itemName);
  this.selectedItem = itemName;
  // console.log(item);
  this.selectedIndex = item;
  // this.d1.nativeElement.insertAdjacentHTML('afterend', '<div class="two">two</div>')

}


}
