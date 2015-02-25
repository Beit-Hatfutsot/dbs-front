angular.module('main').
	factory('musicalChairsFactory', [function() {
		var Game = function(players, chair_count) {
			var self =this;

			var status = players;
			
			this.chair_count = chair_count;
			this.player_status = {};
			
			angular.forEach(status, function(val, key) {
				Object.defineProperty(self.player_status, key, {
					enumerable: true,

					get: function() {
						return status[key];
					},

					set: function(newVal) {
						if (newVal) {
							if ( self.count_sitting() >= self.chair_count ) {
								self.unsit_one();
							}
							status[key] = true;
						}
						else {
							status[key] = false;
						}
					}
				});
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
					this.player_status[player] = false;
				}
				else {
					if ( this.count_sitting >= this.chair_count ) {
						this.unsit_one();
					}
					this.player_status[player] = true;
				}
			},

			unsit_one: function() {
				var count = 1;
				for (var player in this.player_status) {
					if (count === this.count_sitting() && this.player_status[player]) {
						this.player_status[player] = false;
					}
					else if (this.player_status[player]) {
						count++;
					}
				}
			}
		};

		return {
			create_game: function(players, chair_count) {
				return new Game(players, chair_count);
			}
		};
	}]);