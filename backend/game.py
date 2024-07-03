class Gomoku:
    def __init__(self):
        self.board = [[0] * 19 for _ in range(19)]  # 19x19的棋盘，0表示空，1表示玩家1，2表示玩家2
        self.current_player = 1
        self.winner = None

    def reset(self):
        self.__init__()

    def make_move(self, x, y):
        if self.board[x][y] != 0 or self.winner is not None:
            return False

        self.board[x][y] = self.current_player
        if self.check_winner(x, y):
            self.winner = self.current_player
        self.current_player = 3 - self.current_player
        return True

    def check_winner(self, x, y):
        directions = [(1, 0), (0, 1), (1, 1), (1, -1)]
        for dx, dy in directions:
            count = 1
            for step in range(1, 5):
                nx, ny = x + step * dx, y + step * dy
                if 0 <= nx < 19 and 0 <= ny < 19 and self.board[nx][ny] == self.current_player:
                    count += 1
                else:
                    break
            for step in range(1, 5):
                nx, ny = x - step * dx, y - step * dy
                if 0 <= nx < 19 and 0 <= ny < 19 and self.board[nx][ny] == self.current_player:
                    count += 1
                else:
                    break
            if count >= 5:
                return True
        return False

    def get_board(self):
        return self.board

    def get_current_player(self):
        return self.current_player

    def get_winner(self):
        return self.winner