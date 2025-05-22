import { CreditCardInformation, Tokenizer } from "./types";

declare global {
    interface Window {
        Accept?: any;
    }
}

const tokenizeCard = async (cardInfo: CreditCardInformation, paymentIntent: any) => {
    return new Promise((resolve, reject) => {

        const cardNumber = cardInfo.cardNumber.replace(/\s/g, '');
        const expMonth = `${cardInfo.month}`.padStart(2, '0');
        const expYear = cardInfo.year < 100 ? `20${cardInfo.year}` : `${cardInfo.year}`;

        const cardData = {
            cardNumber,
            month: expMonth,
            year: expYear,
            cardCode: cardInfo.cardCode,
            nameOnCard: cardInfo.nameOnCard,
        };


        const secureData = {
            authData: {
                apiLoginID: paymentIntent.apiLoginId,
                clientKey: paymentIntent.publicClientKey,
            },
            cardData
        };

        window.Accept?.dispatchData(secureData, (response: any) => {
            if (response.messages.resultCode === "Error") {
                reject(response.messages.message[0].text);
            } else {
                resolve(response);
            }
        });
    });
}

const registerScripts = () => {
    const scriptId = 'authnet-accept-js';

    // Only add if not already in the DOM
    if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://jstest.authorize.net/v1/Accept.js';
        script.async = true;
        document.body.appendChild(script);
    }
}

const authnetTokenizer: Tokenizer = {
    tokenize: tokenizeCard,
    registerScripts
}
export {
    authnetTokenizer
}