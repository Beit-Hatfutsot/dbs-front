angular.module('main').
	factory('musicalChairsFactory', [function() {
		var Game = function(players, chair_count) {
			var self =this;

			this.chair_count = chair_count;
			this.player_status = {};

			players.forEach(function(player, index) {
				if (index < self.chair_count) {
					self.player_status[player] = true;
				}
				else {
					self.player_status[player] = false
				}
			});
		};

		Game.prototype = {
			count_sitting: function() {
				var count = 0;
				for (var player in this.player_status) {
					if (this.player_status[player]) count++;
				}
				return count;
			},

			flip: function(player) {
				if ( this.player_status[player] ) {
					//this.set_first_sitting()
					this.player_status[player] = false;
				}
				else {
					this.player_status[player] = true;
				}
			}
		};

		return {
			create_game: function(players, chair_count) {
				return new Game(players, chair_count);
			}
		};
	}]);