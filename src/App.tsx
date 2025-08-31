import { Provider } from "react-redux";
import { store } from "./store/store";
import AppContent from "./AppContent";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Provider store={store}>
        <AppContent />
        <Toaster />
      </Provider>
    </>
  );
}

export default App;
