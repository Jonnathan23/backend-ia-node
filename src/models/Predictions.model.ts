import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript'
import Label from './Labels.model';

@Table({
    tableName: 'Prediction',
    timestamps: false
})

class Prediction extends Model {
    @Column({ type: DataType.STRING(200) })
    declare image: string

    @Column({ type: DataType.STRING(50) })
    declare date: string
    
    @HasMany(() => Label)
    declare labels: Label[];    

}

export default Prediction