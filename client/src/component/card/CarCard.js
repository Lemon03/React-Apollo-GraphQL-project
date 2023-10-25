import { Card, Divider } from 'antd';
import UpdateCar from '../button/UpdateCar';
import DeleteCar from '../button/DeleteCar';

export default function CarCard( { year, make, model, price, id, personId} ) {
    return (
        <div>
            <Card
                title={`${year} ${make} ${model} -> $ ${price}`}
                style={{
                    borderRadius: 3, 
                    width: '100%',
                }}
                actions={[
                    <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                        <UpdateCar id={id} personId={personId} year={year} make={make} model={model} price={price}/>
                        <Divider type='vertical' style={{height:"1.5em"}}/>
                        <DeleteCar id={id} />
                    </div>
                ]}
            />
        </div>
    );
}
