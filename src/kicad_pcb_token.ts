// based on:
// include/dsnlexer.h
// common/dsnlexer.cpp 
/*
 * This program source code file is part of kicad-utils
 * Copyright (C) 2017 cho45 <cho45@lowreal.net>.
 *
 * And this program source code file is imported from KiCad, a free EDA CAD application.
 *
 * Original Author Copyright:
 *
 * Copyright (C) 2007-2013 SoftPLC Corporation, Dick Hollenbeck <dick@softplc.com>
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


export class Token {
	static LEFT  = new Token("(");
	static RIGHT = new Token(")");
	// common/pcb.keywords 
	static add_net = new Token("add_net");
	static allowed = new Token("allowed");
	static angle = new Token("angle");
	static arc = new Token("arc");
	static arc_segments = new Token("arc_segments");
	static area = new Token("area");
	static arrow1a = new Token("arrow1a");
	static arrow1b = new Token("arrow1b");
	static arrow2a = new Token("arrow2a");
	static arrow2b = new Token("arrow2b");
	static at = new Token("at");
	static attr = new Token("attr");
	static autoplace_cost90 = new Token("autoplace_cost90");
	static autoplace_cost180 = new Token("autoplace_cost180");
	static aux_axis_origin = new Token("aux_axis_origin");
	static blind = new Token("blind");
	static blind_buried_vias_allowed = new Token("blind_buried_vias_allowed");
	static bold = new Token("bold");
	static bottom = new Token("bottom");
	static center = new Token("center");
	static chamfer = new Token("chamfer");
	static circle = new Token("circle");
	static clearance = new Token("clearance");
	static comment = new Token("comment");
	static company = new Token("company");
	static connect = new Token("connect");
	static connect_pads = new Token("connect_pads");
	static copperpour = new Token("copperpour");
	static crossbar = new Token("crossbar");
	static date = new Token("date");
	static descr = new Token("descr");
	static die_length = new Token("die_length");
	static dimension = new Token("dimension");
	static diff_pair_width = new Token("diff_pair_width");
	static diff_pair_gap = new Token("diff_pair_gap");
	static drawings = new Token("drawings");
	static drill = new Token("drill");
	static edge = new Token("edge");
	static edge_width = new Token("edge_width");
	static effects = new Token("effects");
	static end = new Token("end");
	static feature1 = new Token("feature1");
	static feature2 = new Token("feature2");
	static fill = new Token("fill");
	static fill_segments = new Token("fill_segments");
	static filled_polygon = new Token("filled_polygon");
	static fillet = new Token("fillet");
	static font = new Token("font");
	static fp_arc = new Token("fp_arc");
	static fp_circle = new Token("fp_circle");
	static fp_curve = new Token("fp_curve");
	static fp_line = new Token("fp_line");
	static fp_poly = new Token("fp_poly");
	static fp_text = new Token("fp_text");
	static full = new Token("full");
	static general = new Token("general");
	static grid_origin = new Token("grid_origin");
	static gr_arc = new Token("gr_arc");
	static gr_circle = new Token("gr_circle");
	static gr_curve = new Token("gr_curve");
	static gr_line = new Token("gr_line");
	static gr_poly = new Token("gr_poly");
	static gr_text = new Token("gr_text");
	static hatch = new Token("hatch");
	static hide = new Token("hide");
	static italic = new Token("italic");
	static justify = new Token("justify");
	static keepout = new Token("keepout");
	static kicad_pcb = new Token("kicad_pcb");
	static last_trace_width = new Token("last_trace_width");
	static layer = new Token("layer");
	static layers = new Token("layers");
	static left = new Token("left");
	static links = new Token("links");
	static locked = new Token("locked");
	static micro = new Token("micro");
	static min_thickness = new Token("min_thickness");
	static mirror = new Token("mirror");
	static mod_edge_width = new Token("mod_edge_width");
	static mod_text_size = new Token("mod_text_size");
	static mod_text_width = new Token("mod_text_width");
	static mode = new Token("mode");
	static model = new Token("model");
	static module = new Token("module");
	static net = new Token("net");
	static net_class = new Token("net_class");
	static net_name = new Token("net_name");
	static nets = new Token("nets");
	static no = new Token("no");
	static no_connects = new Token("no_connects");
	static none = new Token("none");
	static not_allowed = new Token("not_allowed");
	static np_thru_hole = new Token("np_thru_hole");
	static offset = new Token("offset");
	static oval = new Token("oval");
	static pad = new Token("pad");
	static pads = new Token("pads");
	static pad_drill = new Token("pad_drill");
	static pad_size = new Token("pad_size");
	static pad_to_mask_clearance = new Token("pad_to_mask_clearance");
	static solder_mask_min_width = new Token("solder_mask_min_width");
	static pad_to_paste_clearance = new Token("pad_to_paste_clearance");
	static pad_to_paste_clearance_ratio = new Token("pad_to_paste_clearance_ratio");
	static page = new Token("page");
	static path = new Token("path");
	static pcb_text_size = new Token("pcb_text_size");
	static pcb_text_width = new Token("pcb_text_width");
	static pcbplotparams = new Token("pcbplotparams");
	static placed = new Token("placed");
	static plus = new Token("plus");
	static polygon = new Token("polygon");
	static portrait = new Token("portrait");
	static priority = new Token("priority");
	static pts = new Token("pts");
	static radius = new Token("radius");
	static rev = new Token("rev");
	static rect = new Token("rect");
	static rect_delta = new Token("rect_delta");
	static reference = new Token("reference");
	static right = new Token("right");
	static rotate = new Token("rotate");
	static roundrect = new Token("roundrect");
	static roundrect_rratio = new Token("roundrect_rratio");
	static scale = new Token("scale");
	static segment = new Token("segment");
	static segment_width = new Token("segment_width");
	static setup = new Token("setup");
	static size = new Token("size");
	static smd = new Token("smd");
	static smoothing = new Token("smoothing");
	static solder_mask_margin = new Token("solder_mask_margin");
	static solder_paste_margin = new Token("solder_paste_margin");
	static solder_paste_margin_ratio = new Token("solder_paste_margin_ratio");
	static solder_paste_ratio = new Token("solder_paste_ratio");
	static start = new Token("start");
	static status = new Token("status");
	static tags = new Token("tags");
	static target = new Token("target");
	static title = new Token("title");
	static title_block = new Token("title_block");
	static tedit = new Token("tedit");
	static thermal_width = new Token("thermal_width");
	static thermal_gap = new Token("thermal_gap");
	static thermal_bridge_width = new Token("thermal_bridge_width");
	static thickness = new Token("thickness");
	static top = new Token("top");
	static trace_width = new Token("trace_width");
	static tracks = new Token("tracks");
	static trace_min = new Token("trace_min");
	static trace_clearance = new Token("trace_clearance");
	static trapezoid = new Token("trapezoid");
	static thru = new Token("thru");
	static thru_hole = new Token("thru_hole");
	static thru_hole_only = new Token("thru_hole_only");
	static tstamp = new Token("tstamp");
	static user = new Token("user");
	static user_trace_width = new Token("user_trace_width");
	static user_via = new Token("user_via");
	static uvia_dia = new Token("uvia_dia");
	static uvia_drill = new Token("uvia_drill");
	static uvia_min_drill = new Token("uvia_min_drill");
	static uvia_min_size = new Token("uvia_min_size");
	static uvia_size = new Token("uvia_size");
	static uvias_allowed = new Token("uvias_allowed");
	static value = new Token("value");
	static version = new Token("version");
	static via = new Token("via");
	static vias = new Token("vias");
	static via_dia = new Token("via_dia");
	static via_drill = new Token("via_drill");
	static via_min_drill = new Token("via_min_drill");
	static via_min_size = new Token("via_min_size");
	static via_size = new Token("via_size");
	static virtual = new Token("virtual");
	static visible_elements = new Token("visible_elements");
	static width = new Token("width");
	static x = new Token("x");
	static xy = new Token("xy");
	static xyz = new Token("xyz");
	static yes = new Token("yes");
	static zone = new Token("zone");
	static zone_45_only = new Token("zone_45_only");
	static zone_clearance = new Token("zone_clearance");
	static zone_connect = new Token("zone_connect");
	static zone_type = new Token("zone_type");
	static zones = new Token("zones");

	constructor( public token: string, public line: number = 0) {
	}

	is(t: Token): boolean {
		return this.token === t.token;
	}

	isNUMBER():boolean {
		return /^[-+]?([0-9]*\.?[0-9]+|[0-9]+)?([eE][-+]?[0-9]+)?$/.test(this.token);
	}

	isSYMBOL():boolean {
		// XXX : symbol is not a keyword
		return /^.+$/i.test(this.token);
	}

	toString(): string {
		return this.token;
	}
}
