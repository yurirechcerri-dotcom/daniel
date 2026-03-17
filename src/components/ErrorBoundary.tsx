import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "Ocorreu um erro inesperado.";
      
      try {
        // Check if it's a Firestore error JSON
        const parsed = JSON.parse(this.state.error?.message || "");
        if (parsed.error && parsed.operationType) {
          errorMessage = "Erro de permissão ou conexão com o banco de dados. Por favor, tente novamente mais tarde.";
        }
      } catch (e) {
        // Not a JSON error, keep default
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
          <div className="bg-neutral-900 border border-white/10 p-12 rounded-[2.5rem] max-w-md">
            <h2 className="text-gold text-2xl font-serif mb-4">Ops! Algo deu errado.</h2>
            <p className="text-neutral-400 mb-8">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gold-dark text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
