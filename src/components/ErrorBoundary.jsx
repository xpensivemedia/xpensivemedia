import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Uncaught error in React tree:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{minHeight: '100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0b0720', color:'#fff', padding:32}}>
          <div style={{maxWidth:800, textAlign:'center'}}>
            <h2 style={{color:'#ff6b6b'}}>Something went wrong</h2>
            <pre style={{textAlign:'left', whiteSpace:'pre-wrap', background:'#000', padding:12, borderRadius:8, overflowX:'auto'}}>{String(this.state.error)}</pre>
            <p style={{opacity:0.8}}>Open DevTools Console for full stack trace.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
