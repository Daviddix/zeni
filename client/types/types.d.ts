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

type goalsType =  {
            id: string,
            name: string,
            total_remaining: number,
            progress_remaining: number,
            total_spent: number,
            progress_completed: number,
            userId: string,
            goal_amount: number,
            created_at: {
                _seconds: number,
                _nanoseconds: number
            }
}