export default class Dimension {
  public creatorId: string;
  public creatorName: string;

  public updaterId: string;
  public updaterName: string;

  public schoolId: string;
  public schoolName: string;


  /**
   * 知识点id
   */
  public knowledgeIds: string;
  public knowledgeNames: Array<string>;

  /**
   * 认知层次
   */
  public cognitionLevelId: string;
  public cognitionLevelName: string;

  /**
   * 关键能力
   */
  public keyAbilityId: string;

  public keyAbilityName: string;

  /**
   * 核心素养
   */
  public keyCompetenceId: string;

  public keyCompetenceName: string;

  /**
   * 复杂度
   */
  public complexityId: number;
  public complexityName: string;

  /**
   * 学业水平
   */
  public studyQualityId: number;
  public studyQualityName: string;

}
