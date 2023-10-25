import { Card, Divider, List } from 'antd';
import DeletePerson from '../button/DeletePerson';
import UpdatePerson from '../button/UpdatePerson';
import CarCard from './CarCard';
import { useQuery } from '@apollo/client'
import { GET_CAR } from '../../graphql/Query'
import { Link } from "react-router-dom";


export default function PersonCard( {id, firstName, lastName} ) {
    const personId = id;
    console.log(personId)

    const { error, data, loading } = useQuery(GET_CAR, {
        variables: { personId }
    });

    if (loading) return 'Loading...';
    if (error) return `${error.message}`
    console.log('data', data)

    return (
        <div>
            <Card
                title={`${firstName} ${lastName}`}
                style={{
                    borderRadius: 3, 
                    width: '100%',
                }}
                actions={[
                    <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                        <UpdatePerson id={id} />
                        <Divider type='vertical' style={{height:"1.5em"}}/>
                        <DeletePerson id={id} />
                    </div>
                ]}
                >
                    {data.car.map(car => (
                    <List.Item key={car.id}>
                        <CarCard 
                        id={car.id} 
                        year={car.year} 
                        make={car.make} 
                        model={car.model} 
                        price={car.price} 
                        personId={car.personId}
                        />
                    </List.Item>
                    ))}
                <Link to={`/page/showpage/${id}`}>Learn More</Link>
            </Card>
        </div>
    );
}
