import React from 'react';
import './App.scss';

import { NameTag } from './components';

const App = () => {
    return (
        <div className="container">
            <h1>Baby Names!</h1>
            <NameTag name='Gregory' />
            <NameTag name='Meghann' />
            <NameTag name='Anna' />
            <NameTag name='Cora' />
        </div>
    );
}

export default App;