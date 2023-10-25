import './App.css';
import AddPerson from './component/form/AddPerson';
import Title from './component/layout/Title';
import { Divider } from 'antd';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import InfoList from './component/card/InfoList';
import AddCar from './component/form/AddCar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Showpage from './component/page/Showpage';
import PageContainer from './component/layout/PageContainer';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache()
});

function App() {
  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Routes>
          <Route path="/" element={
            <PageContainer>
              <Title content={"PEOPLE & THEIR CARS"} />
              <Divider />
              <AddPerson />
              <AddCar />
              <InfoList />
            </PageContainer>
          }/>
          <Route path="/page/showpage/:id" element={<Showpage />} />
        </Routes>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
