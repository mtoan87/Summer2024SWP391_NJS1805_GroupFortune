class WebSocketClient {
    private socket: WebSocket;
  
    constructor(url: string) {
      this.socket = new WebSocket(url);
  
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
      };
  
      this.socket.onmessage = (message) => {
        console.log('Received:', message.data);
      };
  
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
  
      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }
  
    public sendMessage(message: string) {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(message);
      } else {
        console.error('WebSocket is not open');
      }
    }
  }
  
  export default WebSocketClient;
  