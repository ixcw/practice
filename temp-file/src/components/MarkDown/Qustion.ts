import Option from './Option';
import Dimension from './Dimension';

export default class Question extends Dimension{
  public  children: Array<Question>;
  public  options: Array<Option>;
  public  id: string;
  public  parentId: string;
  public  category: number; //题目分类
  public  categoryName: string;
  public  type: number; //题型
  public  typeName: string;
  /**
   * 科目
   */
  public  subjectId: number;
  public  subjectName: string;
  public  content: string;
  public  code: string;
  public  share: number = 0; //0，不共享, 1,共享
  public  status: number = 0;  // -1，删除
  public  hash: string;
  public  dateCreated: Date;
  public  lastUpdated: Date;
  public  childFlag: number = 0;  //0 非子题, 1 子题, 2 内联子题
  public  parentFlag: number = 0; //0 非父级题目, 1,父级题目, 2, 有内联子题, 3有内联子题且另有子题与其对应
  public  constructCode: string; //题目结构编码
  public  answer: string;
  public  analysis: string;
  public  typicalError: string;
}
