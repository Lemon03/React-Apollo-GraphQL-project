import { Divider, List } from 'antd';
import Title from "../layout/Title";
import { useQuery } from '@apollo/client'
import { GET_PEOPLE } from '../../graphql/Query'
import PersonCard from './PersonCard';

export default function InfoList() {
    const { error, data, loading } = useQuery(GET_PEOPLE)
    if (loading) return 'Loading...';
    if (error) return `${error.message}`
    console.log('data', data)

    return (
        <div>
            <Divider>
                <Title content={"Records"} />
            </Divider>  
            <List grid={{ column: 1, gap: 10 }}>
                {data.people.map(({ id, firstName, lastName }) => (
                <List.Item key={id}>
                    <PersonCard id={id} firstName={firstName} lastName={lastName} />
                </List.Item>
                ))}
            </List>
        </div>
    );
}
