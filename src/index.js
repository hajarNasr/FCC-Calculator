import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Calculator extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            input: "",
            equation:[],
            result: [],
            whatToShow: "0",
        }
    }
    render(){
        return(
            <main className="main">
                <Screen 
                whatToShow={this.state.whatToShow}
                />
                <Keypad 
                onClearBtn = {this.clear}
                onEqualSign = {this.handleCalculation}
                onClickBtn={this.handleClick}
                onDotBtn = {this.handleDotClick}
                onSignBtn = {this.handleSignClick}
                onZeroBtn = {this.handleZeroClick}
                />
            </main>

        );
    }
    handleClick = (num)=>{
       let newInput = this.state.input+num;
       let newEquation = [...this.state.equation, newInput]
       this.setState({input:newInput, 
                      whatToShow:newEquation, 
                      result:""});              
    }
    handleZeroClick = (zero)=>{
       if (!parseFloat(this.state.input) && !(this.state.input==="")){
           this.setState({input:"0"});
       }
       else{
           this.handleClick(zero);
       }
    }
    clear = ()=>{
        this.modifyState();
    }
    handleDotClick = ()=>{
        if(this.state.input.indexOf(".") === -1){
            let newEquation = [...this.state.equation, `${this.state.input}.`]
            this.setState({input:`${this.state.input}.`, whatToShow:newEquation});
        }

    }
    handleSignClick= (sign)=>{
        let result = this.state.result;
        if (!result){
           let newEquation = [...this.state.equation, this.state.input, sign]
           this.modifyState(newEquation, newEquation);
        }   
        else{
            this.modifyState([result, sign], result+sign, "", "");
        }  

    }
    
    handleCalculation = ()=>{ 

        let result;
        if (!this.state.input && this.state.equation.length === 0){
            return
        }
        result = this.calculate([...this.state.equation, this.state.input]);
          
        this.modifyState([], result, result);
    }

    modifyState = (equation="", whatToShow="0", result="", input="")=>{
        this.setState({input:input, 
                       equation:equation,
                       whatToShow:whatToShow,
                       result:result});
           
    }
    
    calculate = (equation)=>{
        let eq = equation.filter(item=> item !== "");

        if(eq.length === 1){
            return eq;
        }  
        else{
           let numbers = eq.filter(item=> "+/*-".replace(item,"").length === 4);
           let signs   = eq.filter(item=> "+/*-".replace(item,"").length !== 4)

           return numbers.length === signs.length+1
                 ? this.handleNormalCalculations(eq)
                 : this.handleSignsOverflow(eq);
        }       
     }
     
     handleNormalCalculations= (eq)=>{
        let arrOfSigns = ["*", "/", "-", "+"];
        
        for(let i=0; i < arrOfSigns.length; i++){
            let sign = arrOfSigns[i];
            while(eq.indexOf(sign) !== -1){
                if (eq.length === 3){
                    break;
                } 
                eq= this.computeNumbersBeforeAndAfterSign(eq, sign);
            }
        } 
      return this.calculateTwoNumbers(parseFloat(eq[0]), eq[1], parseFloat(eq[2]));  
     }

     handleSignsOverflow = (eq)=>{
        let newEq = [eq[0]];
        for (let i=1; i<eq.length; i++){
              // Number and sign
             if((parseFloat(newEq[newEq.length-1])===parseFloat(newEq[newEq.length-1])) && (parseFloat(eq[i])!==parseFloat(eq[i]))){
                newEq.push(eq[i]);
             }
             //Sign and sign
             else if ((parseFloat(newEq[newEq.length-1])!==parseFloat(newEq[newEq.length-1])) && (parseFloat(eq[i])!==parseFloat(eq[i]))){
                 if(eq[i]==="-" && parseFloat(eq[i+1])===parseFloat(eq[i+1])){
                    eq[i+1] = `${eq[i+1] *-1}`;
                 }
                 else{
                     newEq[newEq.length-1] = eq[i] ;
                 }
             }
             else{
                 newEq.push(eq[i]);
             }
        }
        return this.handleNormalCalculations(newEq);
     }

     computeNumbersBeforeAndAfterSign = (eq, sign)=>{
        let answer = this.calculateTwoNumbers(
                                parseFloat(eq[eq.indexOf(sign)-1]),
                                sign,
                                parseFloat(eq[eq.indexOf(sign)+1]));
                                
        eq = [...eq.slice(0, eq.indexOf(sign)-1), `${answer}`, ...eq.slice(eq.indexOf(sign)+2, eq.length)]

        return eq;   
     }
    
     calculateTwoNumbers = (num1, sign, num2)=>{
         try{
            switch(sign){
                case "+":
                    return num1 + num2;
                case "/":
                    return num1 / num2;
               case "*":
                    return num1 * num2;
               case "-":
                    return num1 - num2; 
            }        
         }
         catch{
             return "Error!";
         }
     }
     

}

class Screen extends React.Component{
      render(){
          return(
            <label id="display">
              <span className="what-to-show">
                   {this.props.whatToShow}
              </span>
            </label>
          );
      }
}

class Keypad extends React.Component{
      handleClick = (btn)=>{
          switch(btn){
              case "C":
                this.props.onClearBtn();
                break;
              case "=":
                this.props.onEqualSign();
                break;
              case ".":
                  this.props.onDotBtn();
                  break;
              case "0":
                  this.props.onZeroBtn(btn);
                  break;       
              case "+":
              case "-":
              case "/":
              case "*":
                  this.props.onSignBtn(btn);
                  break;
              default:
                this.props.onClickBtn(btn);
                break;

          }

     }
      generatButton(obj){
          return(
            <Button
            key={obj.id}
            id ={obj.id}
            name={obj.name}
            onClickBtn = {this.handleClick}
        />
          );
      }
      render(){
         const top    =    TOPBUTTONS.map(obj=>this.generatButton(obj));
         const bottom = BOTTOMBUTTONS.map(obj=>this.generatButton(obj));
         const right   = RIGHTBOTTONS.map(obj=>this.generatButton(obj));
         const middle = MIDDLEBUTTONS.map(obj=>this.generatButton(obj));
          return(
              <div className="outter-grid">
                  <div className="top">{top}</div>
                  <div className="inner-grid">
                     <div className="middle-bottom-grid">
                        <div className="middle">{middle}</div>
                        <div className="bottom">{bottom}</div>
                     </div>
                     <div className="right">{right}</div>
                  </div>

              </div>
          );
      }
}

class Button extends React.Component{
    handleClick = (e)=>{
        let btn = document.getElementById(e.target.id);
        btn.classList.add('just-clicked');
        setTimeout(() => btn.classList.remove('just-clicked'), 50);
        this.props.onClickBtn(this.props.name);
    }
    render(){
        return(
            <button id={this.props.id} className="button" onClick={this.handleClick}>
                {this.props.name}
            </button>
        );
    }
}

const TOPBUTTONS    = [{name:"C", id:"clear"}, 
                       {name:"/", id:"divide"},
                       {name:"*", id:"multiply"},
                       {name:"-", id:"subtract"}
                    ]

const BOTTOMBUTTONS = [{name:"0", id:"zero"},
                       {name:".", id:"decimal"}
                    ]

const RIGHTBOTTONS  = [{name:"+", id:"add"},
                       {name:"=", id:"equals"}
                    ]

const MIDDLEBUTTONS = [{name:"1", id:"one"},
                       {name:"2", id:"two"},
                       {name:"3", id:"three"},
                       {name:"4", id:"four"},
                       {name:"5", id:"five"},
                       {name:"6", id:"six"},
                       {name:"7", id:"seven"},
                       {name:"8", id:"eight"},
                       {name:"9", id:"nine"}
                    ]

ReactDOM.render(<Calculator/>, document.getElementById('root'));