"use strict";
//#!tsc && NODE_PATH=dist/src node dist/sketch3.js 
/*
 * This program source code file is part of kicad-utils
 * Copyright (C) 2017 cho45 <cho45@lowreal.net>.
 *
 * And this program source code file is imported from KiCad, a free EDA CAD application.
 *
 * Original Author Copyright:
 *
 * Copyright (C) 2015 Jean-Pierre Charras, jaen-pierre.charras@gipsa-lab.inpg.com
 * Copyright (C) 1992-2017 KiCad Developers, see KiCAD AUTHORS.txt for contributors.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, you may find one here:
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * or you may search the http://www.gnu.org website for the version 2 license,
 * or you may write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * IMPL is NOT COMPLETED!!
 */
const kicad_common_1 = require("./kicad_common");
const DEFAULT_LINE_WIDTH = 6;
// pcbnew/plot_board_layers.cpp
// pcbnew/plot_brditems_plotter.cpp 
class PCBPlotter {
    constructor(plotter) {
        this.plotter = plotter;
    }
    flashPadCircle(pos, dia, fill) {
        if (fill === kicad_common_1.Fill.FILLED_SHAPE) {
            this.plotter.circle(pos, dia, fill, 0);
        }
        else {
            let lineWidth = DEFAULT_LINE_WIDTH;
            this.plotter.setCurrentLineWidth(lineWidth);
            if (lineWidth > dia - 2)
                lineWidth = dia - 2;
            this.plotter.circle(pos, dia - lineWidth, kicad_common_1.Fill.NO_FILL, lineWidth);
        }
    }
    flashPadRect(pos, size, orientation, fill) {
        const points = [];
        let lineWidth = DEFAULT_LINE_WIDTH;
        if (fill === kicad_common_1.Fill.FILLED_SHAPE) {
            this.plotter.setCurrentLineWidth(0);
        }
        else {
            this.plotter.setCurrentLineWidth(lineWidth);
        }
        let width = size.width - lineWidth;
        let height = size.height - lineWidth;
        if (width < 1)
            width = 1;
        if (height < 1)
            height = 1;
        const dx = width / 2;
        const dy = height / 2;
        points.push(new kicad_common_1.Point(pos.x - dx, pos.y + dy));
        points.push(new kicad_common_1.Point(pos.x - dx, pos.y - dy));
        points.push(new kicad_common_1.Point(pos.x + dx, pos.y - dy));
        points.push(new kicad_common_1.Point(pos.x + dx, pos.y + dy));
        for (let point of points) {
            kicad_common_1.RotatePointWithCenter(point, pos, orientation);
        }
        points.push(points[0]);
        this.plotter.polyline(points, fill, lineWidth);
    }
}
exports.PCBPlotter = PCBPlotter;
//# sourceMappingURL=kicad_pcb_plotter.js.map