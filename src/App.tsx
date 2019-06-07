import React, {Component} from 'react';
import './App.scss';
import IProduct from "./model/IProduct";

class VendingMachine extends Component {
    products: IProduct[] = require('./api/products.json');
    boughtProducts: string[] = [];
    inputCode: any;
    inputBudget: any;


    state = {
        products: [],
        chosenProd: 0,
        budget: 0,
        value: 0,
        rest: 0,
        clear: false,
        restClicked: false,
        budgetError: '',
        codeError: '',
        successMessage: '',
        validAmount: false,
        validCode: false
    };

    handleBudgetChange = (e: any) => {
        const val = e.target.value;
        // console.log(e.target)
        this.setState({
            budgetError: '',
            validAmount: false
        });
        if (val && val <= 100 && val.substr(0, 1) !== '0') {
            this.setState({
                value: val,
                validAmount: true
            })
        } else {
            this.setState({budgetError: 'Entered amount must be a valid number and a bill of maximum 100 RON.'})
        }
    }

    addBudget = (e: any) => {
        e.preventDefault();
        let total = +this.state.budget + +this.state.value;
        this.inputBudget.value = '';

        this.setState({
            budget: total,
            rest: total
        })
    }

    handleProduct = (e: any) => {
        const code = e.target.value;
        console.log(code);
        this.setState({
            codeError: ``,
            validCode: false,
            clear: false
        })
        if (!isNaN(code)) {
            if (code < 1 || code > this.products.length || code.substr(0, 1) === '0') {
                this.setState({codeError: `The ${code} code is not available.`})
            } else {
                this.setState({
                    validCode: true,
                    chosenProd: code
                })
            }
        } else {
            this.setState({codeError: `The ${code} code is not valid. The code must be a valid number.`})
        }
    }

    handleBuy = (e: any) => {
        e.preventDefault();

        let prod = this.products.filter(product => product.code == this.state.chosenProd)[0];
        let rest = this.state.budget - prod.price;
        this.setState({rest: rest});
        if (rest >= 0 && prod.quantity) {
            this.setState({
                successMessage: `Congrats! You bought 1 ${prod.name}.`,
                budget: rest,
                clear: false
            })
            this.inputCode.value = '';
            this.boughtProducts.push(prod.name);
            prod.quantity--;
        } else {
            this.setState({successMessage: `Oops! You don't have enough budget for ${prod.name}.`})
        }
    }

    giveRest = (e: any) => {
        this.setState({
            budget: 0,
            restClicked: true,
        })
    }

    isCleared = (e: any) => {
        this.setState({
            chosenProd: 0,
            clear: true,
            successMessage: ''
        })
        this.inputCode.value = '';
    }

    render() {
        return (
            <div className="VendingMachine">
                <header className="App-header">
                    Vending Machine
                </header>
                <div>
                    {
                        this.products.map((product: any) => (
                            <div className="product">
                                <div>{product.name}</div>
                                <div>Code: {product.code}</div>
                                <div>Price: {product.price}</div>
                                <div>Quantity: {product.quantity}</div>
                            </div>
                        ))
                    }
                </div>
                <form>
                    <div className="input">
                        <label htmlFor="amount">Amount: </label>
                        <input type="text" name="budget" id="amount"
                               onChange={this.handleBudgetChange} placeholder="10(RON)"
                               ref={el => this.inputBudget = el}/>
                        <button type="submit" onClick={this.addBudget} disabled={!this.state.validAmount}>Add money
                        </button>
                    </div>
                    {this.state.budgetError && <p>{this.state.budgetError}</p>}
                    <div className="input">
                        <label htmlFor="code">Product code: </label>
                        <input type="text" onChange={this.handleProduct} ref={el => this.inputCode = el}/>
                        <button type="submit" onClick={this.handleBuy}
                                disabled={!this.state.validCode || this.state.clear}>Buy!
                        </button>
                    </div>
                    {this.state.codeError && <p>{this.state.codeError}</p>}
                </form>
                {this.state.successMessage && <div>{this.state.successMessage}</div>}
                <div>Your budget: {this.state.budget} RON</div>
                <div>
                    <button id="clear" type="submit" onClick={this.isCleared}
                            disabled={this.state.chosenProd < 1}>Clear basket!
                    </button>
                    <button type="submit" onClick={this.giveRest} disabled={this.state.budget <= 0}>Give the rest!
                    </button>
                </div>
                {this.state.clear && <div>Your basket was cleared!</div>}
                {this.state.restClicked &&
                <div>Thank you for using our vending machine! Your rest is {this.state.rest} RON.</div>}
                {this.boughtProducts.length != 0 &&
                    <div> You bought:
                        {this.boughtProducts.map(product => <span> {product} </span>)}
                    </div>
                }
            </div>
        );
    }
}

export default VendingMachine;
