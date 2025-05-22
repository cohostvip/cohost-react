export interface CreditCardInformation {
    cardNumber: string;
    month: number;
    year: number;
    cardCode: string;
    nameOnCard: string;
}

export type Tokenizer = {
    tokenize: (cardInfo: CreditCardInformation, paymentIntent: any) => Promise<any>;
    registerScripts: () => void;
}
