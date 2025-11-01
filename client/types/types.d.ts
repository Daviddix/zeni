type userDetailsType = {
  success : boolean;
  user : {
    email : string;
    image : string;
    fullname : string;
    currency : {
      name : string;
      symbol : string;
    }
  }

}

type expenseType = {
  id : string;
  amount : number;
  name : string;
  category : string;
  date : string;
}