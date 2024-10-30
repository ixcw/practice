import React, { useState } from 'react';
import { ClickCounter } from './components/ClickCounter';
import { FriendStatus } from 'components/FriendStatus';
import { RefDemo } from 'components/RefDemo';
import { ReducerDemo } from 'components/ReducerDemo';
import Father from 'components/MemoDemo';

function App() {

  return (
    <div>
      <Father />
    </div>
  );
}

export default App;
