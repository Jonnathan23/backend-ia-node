import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import Prediction from './Predictions.model';


@Table({
  tableName: 'Label',
  timestamps: false
})

class Label extends Model {
  @Column({ type: DataType.STRING(100), allowNull: false })
  declare label: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare confidence: number;
  
  @ForeignKey(() => Prediction)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare predictionId: number;
}

export default Label;
