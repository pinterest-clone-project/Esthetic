using Domain.Entities.Board;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Data.Repositories;

    public class BoardRepository : BaseRepository<BoardEntity>, IBoardRepository
    {
        public BoardRepository(AppDbContext db) : base(db) { }
    }

