using Domain.Entities.Board;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Data.Repositories
{
    public class BoardPinRepository : BaseRepository<BoardPinEntity>, IBoardPinRepository
    {
        public BoardPinRepository(AppDbContext db) : base(db) { }
    }
}
