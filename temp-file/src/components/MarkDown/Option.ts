import Dimension from './Dimension';

export default class Option extends Dimension{
   public id:string

   public questionId:string

   public code:string

   public content:string//内容

   // bingo // 0, 错误  1正确

   public status:number = 0;  // -1，删除

   public hash:string

   public dateCreated:Date

   public lastUpdated:Date

   public questionNum: number//题目编号位置

   public singleCode: string

}
